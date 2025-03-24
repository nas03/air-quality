from datetime import date
import json
import logging
import os
from io import StringIO
from typing import Dict, List, Any, Optional

import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Configure psycopg2 adapters
psycopg2.extensions.register_adapter(np.int64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float64, psycopg2._psycopg.AsIs)


# Data fetching functions for Hanoi source
def fetch_hanoi_station_data():
    """Fetch station data from Hanoi API"""
    URL = "https://moitruongthudo.vn/api/site"
    response = requests.get(URL)
    response.raise_for_status()
    return response.json()


def fetch_hanoi_station_details(station_id: str) -> Optional[float]:
    """Fetch PM2.5 details for a Hanoi station"""
    URL = f"https://moitruongthudo.vn/public/dailystat/{station_id}"
    try:
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()["PM2.5"]
        validData = []
        # Convert now to GMT+7
        now_utc = datetime.utcnow()
        now_gmt7 = now_utc + timedelta(hours=7)
        today_gmt7 = now_gmt7.date()

        for item in data:
            item_time = datetime.strptime(item["time"], "%Y-%m-%d %H:%M")
            if item_time.date() == today_gmt7:
                validData.append(item)

        pm25_values = [np.float64(item["value"]) for item in validData]
        return float(np.mean(pm25_values)) if pm25_values else None
    except (requests.exceptions.RequestException, KeyError, ValueError) as e:
        logger.error(f"Error fetching details for Hanoi station {station_id}: {e}")
        return None


# Data fetching functions for Envisoft source
def fetch_envisoft_station_data():
    """Fetch station data from Envisoft API"""
    URL = "https://envisoft.gov.vn/eos/services/call/json/get_stations"
    response = requests.post(
        URL,
        None,
        {
            "is_qi": True,
            "is_public": True,
            "qi_type": "aqi",
        },
    )
    response.raise_for_status()
    return response.json()["stations"]


def fetch_envisoft_station_details(station_id: str) -> Optional[float]:
    """Fetch PM2.5 details for an Envisoft station"""
    URL = "https://envisoft.gov.vn/eos/services/call/json/qi_detail"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Origin": "https://cem.gov.vn",
        "Referer": "https://cem.gov.vn/",
    }
    try:
        response = requests.post(URL, data={"station_id": station_id}, headers=headers)
        response.raise_for_status()
        data = response.json()["res"]
        pm25_values = [float(list(item.keys())[0]) for item in data["PM-2-5"]["values"]]
        return float(np.mean(pm25_values)) if pm25_values else None
    except (requests.exceptions.RequestException, KeyError, ValueError) as e:
        logger.error(f"Error fetching details for Envisoft station {station_id}: {e}")
        return None


def process_hanoi_data(data: List[Dict[str, Any]]) -> pd.DataFrame:
    """Process raw data from Hanoi source into DataFrame"""
    df = pd.read_json(StringIO(json.dumps(data, ensure_ascii=False)), dtype={"id": str})
    df = df.rename(
        columns={
            "id": "station_id",
            "longtitude": "lng",
            "latitude": "lat",
            "aqi": "aqi_index",
            "aqi_time": "timestamp",
            "name": "station_name",
        }
    )

    df["station_name"] = df["station_name"].str.replace('"', "", regex=False)
    df["address"] = df["address"].str.replace('"', "", regex=False)
    df["station_id"] = df["station_id"].astype(str).str.replace(".0", "")
    df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.date.astype(str)
    return df


def process_envisoft_data(data: List[Dict[str, Any]]) -> pd.DataFrame:
    """Process raw data from Envisoft source into DataFrame"""
    df = pd.read_json(StringIO(json.dumps(data, ensure_ascii=False)), dtype={"id": str})
    df = df.rename(
        columns={
            "id": "station_id",
            "longitude": "lng",
            "latitude": "lat",
            "qi": "aqi_index",
            "qi_time": "timestamp",
        }
    )

    df["station_name"] = df["station_name"].str.replace("(KK)", "").str.strip()
    df["station_id"] = df["station_id"].astype(str)
    df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.date.astype(str)
    return df


def prepare_common_data(df: pd.DataFrame) -> pd.DataFrame:
    """Apply common data processing steps"""
    # Record the initial row count
    initial_row_count = len(df)

    # Handle NaT values in timestamp before converting to string
    df["timestamp"] = df["timestamp"].replace({pd.NaT: None})

    # Convert aqi_index to numeric, coercing non-numeric values to NaN
    df["aqi_index"] = pd.to_numeric(df["aqi_index"], errors="coerce")

    # Before dropping rows, apply other transformations
    df["pm25"] = df["pm25"].replace({np.nan: None})
    df["lat"] = df["lat"].replace({np.nan: None})
    df["lng"] = df["lng"].replace({np.nan: None})

    # Drop rows with any NaN, None, or NaT values in important columns
    columns_to_check = ["station_id", "timestamp", "aqi_index", "lat", "lng"]
    df = df.dropna(subset=columns_to_check).copy()  # Create an explicit copy here

    # Log how many rows were removed
    rows_removed = initial_row_count - len(df)
    if rows_removed > 0:
        logger.info(f"Removed {rows_removed} rows with missing values")

    # Continue with transformations on the filtered data using .loc
    df.loc[:, "timestamp"] = df["timestamp"].astype(str).replace({"None": None})
    df.loc[:, "aqi_index"] = round(df["aqi_index"]).astype(int)

    # Create geom column using .loc
    df.loc[:, "geom"] = df.apply(
        lambda row: f"SRID=4326;POINT({row['lng']} {row['lat']})", axis=1
    )
    return df


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
    records = df[
        [
            "pm25",
            "address",
            "station_name",
            "station_id",
            "aqi_index",
            "status",
            "color",
            "timestamp",
            "lat",
            "lng",
            "geom",
        ]
    ].to_records(index=False)

    values = [tuple(r) for r in records]
    insert_query = """
    INSERT INTO stations (
        pm25, address, station_name, station_id, aqi_index, status,
        color, timestamp, lat, lng, geom
    )
    VALUES %s
    ON CONFLICT (station_id) DO UPDATE SET
        aqi_index = EXCLUDED.aqi_index,
        status = EXCLUDED.status,
        color = EXCLUDED.color,
        timestamp = EXCLUDED.timestamp,
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng,
        geom = EXCLUDED.geom,
        station_name = EXCLUDED.station_name,
        address = EXCLUDED.address,
        pm25 = EXCLUDED.pm25;
    """

    with conn.cursor() as cur:
        psycopg2.extras.execute_values(cur, insert_query, values)
    conn.commit()


def collect_pm25_data(df: pd.DataFrame, source: str) -> pd.DataFrame:
    """Collect PM2.5 data for all stations"""
    pm25_df = pd.DataFrame({"station_id": [], "pm25": []})

    for station_id in df["station_id"]:
        if source == "hanoi":
            pm25_data = fetch_hanoi_station_details(station_id)
        else:
            pm25_data = fetch_envisoft_station_details(station_id)

        pm25_df = pd.concat(
            [pm25_df, pd.DataFrame({"station_id": [station_id], "pm25": [pm25_data]})],
            ignore_index=True,
        )

    return df.merge(pm25_df, on="station_id", how="left")


def scrape_source(source: str):
    """Scrape data from a specific source"""
    try:
        logger.info(f"Starting data scraping process for {source}")

        # Fetch and process data
        if source == "hanoi":
            data = fetch_hanoi_station_data()
            df = process_hanoi_data(data)
        else:
            data = fetch_envisoft_station_data()
            df = process_envisoft_data(data)

        logger.info("Successfully processed initial data")

        # Collect PM2.5 data
        df = prepare_common_data(collect_pm25_data(df, source))
        logger.info("Successfully collected PM2.5 data")

        # Database operations
        conn = get_db_connection()
        insert_data(df, conn)
        conn.close()

        logger.info("Successfully inserted data into database")

    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data: {e}")
    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        raise


def scrape_stations_data():
    """Scrape data from all sources"""
    for source in ["hanoi", "envisoft"]:
        scrape_source(source)


__all__ = ["scrape_stations_data"]
if __name__ == "__main__":
    scrape_stations_data()
