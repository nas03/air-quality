import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from io import StringIO

import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
import requests as rq
from dotenv import load_dotenv
from osgeo import gdal  # type: ignore

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

psycopg2.extensions.register_adapter(np.int64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float64, psycopg2._psycopg.AsIs)


def download_grib_file(
    url: str, params: Dict[str, str], output_dir: str
) -> Optional[str]:
    """Download a GRIB file from NCEP.

    Args:
        url: The base URL to download from
        params: Dictionary of query parameters
        output_dir: Directory to save the downloaded file

    Returns:
        Path to the downloaded file or None if download failed
    """
    os.makedirs(output_dir, exist_ok=True)

    response = rq.get(url, params=params, stream=True)
    output_file = os.path.join(output_dir, params["file"])

    if response.status_code != 200:
        print(f"Failed to download file: HTTP {response.status_code}")
        return None

    with open(output_file, "wb") as f:
        for chunk in response.iter_content():
            f.write(chunk)
    print(f"File successfully downloaded to {output_file}")

    return output_file


def process_grib_file(grib_file: str) -> pd.DataFrame:
    """Process GRIB file and extract meteorological data.

    Args:
        grib_file: Path to the GRIB file

    Returns:
        Dictionary containing timestamp and meteorological data
    """
    ds = gdal.Open(grib_file)

    ref_time = ds.GetRasterBand(1).GetMetadata().get("GRIB_REF_TIME")

    timestamp = datetime.fromtimestamp(int(ref_time)).isoformat()

    data_dict = {"timestamp": timestamp, "vgrid_data": [], "ugrid_data": []}

    for i in range(1, ds.RasterCount + 1):
        band = ds.GetRasterBand(i)
        metadata = band.GetMetadata()
        raster_data = band.ReadAsArray()

        data_type = metadata.get("GRIB_ELEMENT", f"band_{i}")

        data = raster_data.flatten().tolist()
        if data_type == "VGRD":
            data_dict["vgrid_data"] = [data]
        else:
            data_dict["ugrid_data"] = [data]
    ds = None
    df = pd.DataFrame(data_dict)
    return df


def cleanup_temp_file(file_path: str) -> None:
    """Remove temporary file.

    Args:
        file_path: Path to the file to remove
    """
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Deleted temporary GRIB file: {file_path}")
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")


def get_default_params(
    date_str: Optional[str] = None,
) -> Dict[str, str]:
    """Get default parameters for NCEP data request.

    Args:
        date_str: Date string in YYYYMMDD format (defaults to today)
        cycle: GFS cycle hour (00, 06, 12, 18) - defaults to current UTC time cycle

    Returns:
        Dictionary of request parameters
    """
    if not date_str:
        date_str = datetime.now().strftime("%Y%m%d")

    cycle = "00"

    current_hour = datetime.now(timezone.utc).hour
    if 0 <= current_hour < 6:
        cycle = "00"
    elif 6 <= current_hour < 12:
        cycle = "06"
    elif 12 <= current_hour < 18:
        cycle = "12"
    else:
        cycle = "18"

    return {
        "dir": f"/gfs.{date_str}/{cycle}/atmos",
        "file": f"gfs.t{cycle}z.pgrb2.0p25.f000",
        "var_UGRD": "on",
        "var_VGRD": "on",
        "lev_10_m_above_ground": "on",
        "subregion": "",
        "toplat": "24",
        "leftlon": "101.8",
        "rightlon": "110.3",
        "bottomlat": "8",
    }


def get_db_connection():
    """Create database connection using environment variables"""
    load_dotenv(".env")
    # Try to load .env file, but don't fail if it doesn't exist
    load_dotenv(".env", override=True)

    # Get connection parameters with fallbacks and error checking
    conn_params = {
        "dbname": os.getenv("SUPABASE_DB_NAME"),
        "user": os.getenv("SUPABASE_DB_USER"),
        "password": os.getenv("SUPABASE_DB_PASSWORD"),
        "host": os.getenv("SUPABASE_DB_HOST"),
        "port": os.getenv("SUPABASE_DB_PORT"),
    }

    # Check if any required parameters are missing
    missing_params = [k for k, v in conn_params.items() if v is None]
    if missing_params:
        error_msg = (
            f"Missing database connection parameters: {', '.join(missing_params)}"
        )
        logger.error(error_msg)
        logger.info("Ensure environment variables are set or .env file exists")
        raise ValueError(error_msg)
    log_params = dict(conn_params)
    log_params["password"] = "********" if conn_params["password"] else None
    logger.info(f"Database connection parameters: {log_params}")
    return psycopg2.connect(**conn_params)


def insert_data(df: pd.DataFrame, conn):
    """Insert DataFrame into database"""
    records = df[["timestamp", "ugrid_data", "vgrid_data"]].to_records(index=False)

    values = [tuple(r) for r in records]
    insert_query = """
    INSERT INTO wind_data (timestamp, ugrid_data, vgrid_data)
    VALUES %s
    ON CONFLICT (timestamp) DO UPDATE SET
        vgrid_data = EXCLUDED.vgrid_data,
        ugrid_data = EXCLUDED.ugrid_data;
    """

    with conn.cursor() as cur:
        psycopg2.extras.execute_values(cur, insert_query, values)
    conn.commit()


def scrape_wind_data(
    ncep_url: str = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25_1hr.pl",
    output_dir: str = "./temp",
):
    """Scrape NCEP GFS data, process it and save as JSON.

    Args:
        ncep_url: Base URL for NCEP data
        output_dir: Directory to save temporary and output files

    Returns:
        String containing logs of the scraping process
    """
    # Create string buffer to capture logs
    log_capture_string = StringIO()
    log_handler = logging.StreamHandler(log_capture_string)
    log_handler.setLevel(logging.INFO)
    log_formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    log_handler.setFormatter(log_formatter)
    logger.addHandler(log_handler)

    try:
        params = get_default_params()

        grib_file = download_grib_file(ncep_url, params, output_dir)
        if not grib_file:
            logger.error("Failed to download GRIB file")
            return {"success": False, "log": log_capture_string.getvalue()}

        logger.info(f"Successfully downloaded GRIB file to {grib_file}")
        df = process_grib_file(grib_file)
        logger.info("Successfully processed GRIB file data")

        conn = get_db_connection()
        insert_data(df, conn)
        conn.close()
        logger.info("Successfully inserted wind data into database")

        cleanup_temp_file(grib_file)
        logger.info("Cleaned up temporary files")

        # Get log contents
        log_handler.flush()
        log_contents = log_capture_string.getvalue()

        return {"success": True, "log": log_contents}
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return {"success": False, "log": log_capture_string.getvalue()}
    finally:
        # Clean up
        logger.removeHandler(log_handler)
        log_capture_string.close()


__all__ = ["scrape_wind_data"]

if __name__ == "__main__":
    logs = scrape_wind_data()
    print(logs)
