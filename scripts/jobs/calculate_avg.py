import datetime
import glob
import logging
import os
from typing import List, Tuple

import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from osgeo import gdal  # type: ignore

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Register adapters for numpy data types
psycopg2.extensions.register_adapter(np.int64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float32, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.datetime64, psycopg2._psycopg.AsIs)

# Constants
FOLDER_GEOTIFF_PATH = "assets/input"
META_PATH = "assets/data/districtsVN.xlsx"
DIST_PATH = "assets/data/VN_districts_100m.tif"
TEMP_FILE = "temp.tif"
NODATA_VALUE = -9999
DIST_NODATA = 65535

# Load district data
meta = pd.read_excel(META_PATH)
dist_ds = gdal.Open(DIST_PATH, gdal.GA_ReadOnly)
dist = dist_ds.ReadAsArray()

# Get geotransform parameters
ulx, xres, xskew, uly, yskew, yres = dist_ds.GetGeoTransform()
lrx = ulx + (dist_ds.RasterXSize * xres)
lry = uly + (dist_ds.RasterYSize * yres)


def lerp(aqi_low, aqi_high, conc_low, conc_high, conc):
    """Linear interpolation function with division by zero check."""
    if conc_high == conc_low:
        return 0  # Or another default value
    return aqi_low + (conc - conc_low) * (aqi_high - aqi_low) / (conc_high - conc_low)


def calculate_aqi(pm25):
    """Convert PM2.5 concentration to AQI."""
    if np.isnan(pm25):  # Check if pm25 is NaN
        return None  # Or return None if you prefer

    c = round(pm25 * 10) / 10  # Equivalent to Math.floor(10 * pm25) / 10
    if c < 0:
        return 0  # Values below 0 are beyond AQI
    elif c < 12.1:
        return round(lerp(0, 50, 0.0, 12.0, c))
    elif c < 35.5:
        return round(lerp(51, 100, 12.1, 35.4, c))
    elif c < 55.5:
        return round(lerp(101, 150, 35.5, 55.4, c))
    elif c < 150.5:
        return round(lerp(151, 200, 55.5, 150.4, c))
    elif c < 250.5:
        return round(lerp(201, 300, 150.5, 250.4, c))
    elif c < 350.5:
        return round(lerp(301, 400, 250.5, 350.4, c))
    elif c < 500.5:
        return round(lerp(401, 500, 350.5, 500.4, c))
    else:
        return 500  # Values above 500 are beyond AQI


def get_time_info(filename: str) -> datetime.datetime:
    """Extract datetime from filename."""
    date_part = filename.split("_")[1]
    year = int(date_part[0:4])
    month = int(date_part[4:6])
    day = int(date_part[6:8])
    return datetime.datetime(year, month, day)


def process_geotiff(filepath: str) -> Tuple[np.ndarray, np.ndarray]:
    """Process GeoTIFF file and return data and district arrays."""
    gdal.Warp(
        TEMP_FILE,
        filepath,
        format="GTiff",
        dstSRS="+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs",
        xRes=100,
        yRes=-100,
        outputBounds=(ulx, lry, lrx, uly),
        resampleAlg="near",
        creationOptions=["COMPRESS=LZW"],
    )

    data = gdal.Open(TEMP_FILE, gdal.GA_ReadOnly).ReadAsArray()
    rows, cols = data.shape

    new_data = np.reshape(data, rows * cols)
    new_dist = np.reshape(dist, rows * cols)

    mask = (new_data != NODATA_VALUE) & (new_dist != DIST_NODATA)
    return new_data[mask], new_dist[mask]


def create_dataframe(
    data: np.ndarray, dist_data: np.ndarray, time_info: datetime.datetime
) -> pd.DataFrame:
    """Create and process DataFrame from arrays."""
    df = pd.DataFrame({"dist_ID": dist_data, "pm_25": data})
    df = df.groupby("dist_ID", as_index=False).mean()
    df = df.dropna(subset=["pm_25"])
    df["aqi_index"] = df["pm_25"].apply(calculate_aqi)
    df["time"] = time_info

    # Merge with metadata
    sub_meta = meta[["ID", "GID_2"]].rename(columns={"ID": "dist_ID", "GID_2": "GID_2"})
    df = pd.merge(df, sub_meta)
    df = df.rename(columns={"GID_2": "district_id"})
    df = df.drop(columns=["dist_ID"])

    return df[["district_id", "pm_25", "aqi_index", "time"]]


def prepare_dataframe(filepath) -> pd.DataFrame:
    """Process GeoTIFF files and prepare DataFrame."""

    logger.info(f"Processing file: {filepath}")
    _, filename = os.path.split(filepath)
    time_info = get_time_info(filename)
    data, dist_data = process_geotiff(filepath)
    return create_dataframe(data, dist_data, time_info)


def get_db_connection():
    """Create database connection using environment variables"""
    load_dotenv()

    conn_params = {
        "dbname": os.getenv("SUPABASE_DB_NAME"),
        "user": os.getenv("SUPABASE_DB_USER"),
        "password": os.getenv("SUPABASE_DB_PASSWORD"),
        "host": os.getenv("SUPABASE_DB_HOST"),
        "port": os.getenv("SUPABASE_DB_PORT"),
    }

    return psycopg2.connect(**conn_params)


def insert_data(df: pd.DataFrame, conn: psycopg2.extensions.connection) -> None:
    """Insert DataFrame into database."""
    # Convert timestamp to string in ISO format with timezone
    df["time"] = df["time"].dt.strftime("%Y-%m-%d %H:%M:%S%z")

    records = df[["district_id", "pm_25", "aqi_index", "time"]].to_records(index=False)
    values = [tuple(r) for r in records]

    insert_query = """
    INSERT INTO statistics (district_id, pm_25, aqi_index, time)
    VALUES %s
    ON CONFLICT (district_id, pm_25, aqi_index, time) DO NOTHING
    """

    with conn.cursor() as cur:
        psycopg2.extras.execute_values(
            cur, insert_query, values, template="(%s, %s, %s, %s)"
        )


def uploadData() -> None:
    """Main function to scrape and process data."""
    try:
        logger.info("Starting data scraping process")
        conn = get_db_connection()
        log = []
        for filepath in glob.iglob(os.path.join(FOLDER_GEOTIFF_PATH, "*.tif")):
            df = prepare_dataframe(filepath=filepath)
            log.append(df)
        df = pd.concat(log)
        insert_data(df, conn)
        conn.commit()
        conn.close()

        logger.info("Successfully inserted data into database")

    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        raise


__all__ = ["uploadData"]

if __name__ == "__main__":
    uploadData()
