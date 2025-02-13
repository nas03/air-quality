import json
import logging
import os
from io import StringIO
from pydoc import text

import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
import requests
from dotenv import load_dotenv


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


psycopg2.extensions.register_adapter(np.int64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float64, psycopg2._psycopg.AsIs)


def fetch_hanoi_station_data():
    """Fetch station data from the API"""
    URL = "https://moitruongthudo.vn/api/site"

    response = requests.get(URL)
    response.raise_for_status()
    return response.json()


def fetch_hanoi_station_details(station_id):
    """Fetch detailed data for a specific station"""
    URL = f"https://moitruongthudo.vn/public/dailystat/{station_id}"

    response = requests.get(URL)
    response.raise_for_status()
    return response.json()["PM2.5"]


def prepare_dataframe(data):
    """Process raw data into a formatted DataFrame"""
    df = pd.read_json(StringIO(json.dumps(data, ensure_ascii=False)), dtype={"id": str})

    column_mapping = {
        "id": "station_id",
        "longtitude": "lng",
        "latitude": "lat",
        "aqi": "aqi_index",
        "aqi_time": "timestamp",
        "name": "station_name",
        "status": "status",
        "address": "address",
        "color": "color",
    }

    selected_columns = list(column_mapping.values())
    df = df.rename(columns=column_mapping)[selected_columns]

    df["station_name"] = df["station_name"].str.replace('"', "", regex=False)
    df["address"] = df["address"].str.replace('"', "", regex=False)

    pm25DF = pd.DataFrame({"station_id": [], "pm25": []}).astype(
        {"station_id": str, "pm25": float}
    )
    for station_id in df["station_id"]:
        try:
            stationData = fetch_hanoi_station_details(station_id)
            pm25_values = [np.float64(item["value"]) for item in stationData]
            pm25Data = np.mean(pm25_values) if pm25_values else None
        except (requests.exceptions.RequestException, KeyError, ValueError) as e:
            logger.error(
                f"Error fetching/processing details for station {station_id}: {e}"
            )
            pm25Data = None
        finally:
            pm25DF = pd.concat(
                [
                    pm25DF,
                    pd.DataFrame({"station_id": [station_id], "pm25": [pm25Data]}),
                ],
                ignore_index=True,
            )

    df = df.merge(pm25DF, on="station_id", how="left")

    df["pm25"] = df["pm25"].replace({np.nan: None})
    df["timestamp"] = df["timestamp"].astype(str)
    df["aqi_index"] = round(df["aqi_index"]).astype(int)
    df["lat"] = df["lat"].replace({np.nan: None})
    df["lng"] = df["lng"].replace({np.nan: None})

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
    INSERT INTO stations (pm25, address, station_name, station_id, aqi_index, status, color, timestamp, lat, lng, geom)
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


def scrape():
    try:
        logger.info("Starting data scraping process")

        # Fetch data
        data = fetch_hanoi_station_data()
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


if __name__ == "__main__":
    scrape()
