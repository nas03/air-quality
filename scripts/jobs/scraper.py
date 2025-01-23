import json
import logging
import os
from io import StringIO

import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
import requests
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Register adapters for numpy data types
psycopg2.extensions.register_adapter(np.int64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float64, psycopg2._psycopg.AsIs)


def fetch_station_data():
    """Fetch station data from the API"""
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


def prepare_dataframe(data):
    """Process raw data into a formatted DataFrame"""
    df = pd.read_json(StringIO(json.dumps(data, ensure_ascii=False)), dtype={"id": str})

    # Rename columns
    df = df.rename(
        columns={
            "id": "station_id",
            "status": "status",
            "longitude": "lng",
            "latitude": "lat",
            "qi": "aqi_index",
            "qi_time": "timestamp",
            "station_name": "station_name",
        }
    )

    # Format data
    df["timestamp"] = df["timestamp"].astype(str) + "+07"
    df["aqi_index"] = round(df["aqi_index"]).astype(int)
    df["station_name"] = df["station_name"].str.replace("(KK)", "").str.strip()

    # Convert types
    df["station_id"] = df["station_id"].astype(str)
    df["aqi_index"] = df["aqi_index"].astype(int)
    df["lat"] = df["lat"].astype(float)
    df["lng"] = df["lng"].astype(float)

    # Add geometry
    df["geom"] = df.apply(
        lambda row: f"SRID=4326;POINT({row['lng']} {row['lat']})", axis=1
    )

    return df


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


def insert_data(df, conn):
    """Insert DataFrame into database"""
    records = df[
        [
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
    INSERT INTO stations_point_map (station_id, aqi_index, status, color, timestamp, lat, lng, geom)
    VALUES %s
    ON CONFLICT (station_id) DO UPDATE SET
        aqi_index = EXCLUDED.aqi_index,
        status = EXCLUDED.status,
        color = EXCLUDED.color,
        timestamp = EXCLUDED.timestamp,
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng,
        geom = EXCLUDED.geom;
    """

    with conn.cursor() as cur:
        psycopg2.extras.execute_values(cur, insert_query, values)
    conn.commit()


def scrape():
    try:
        logger.info("Starting data scraping process")

        # Fetch data
        data = fetch_station_data()
        logger.info("Successfully fetched station data")

        # Process data
        df = prepare_dataframe(data)
        logger.info("Successfully processed data into DataFrame")

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


# Export the function
__all__ = ["scrape"]


if __name__ == "__main__":
    scrape()
