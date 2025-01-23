import json
import os
from io import StringIO

import numpy as np
import pandas as pd
import psycopg2
import psycopg2.extras
import requests
from dotenv import load_dotenv

# Register adapters for numpy data types
psycopg2.extensions.register_adapter(np.int64, psycopg2._psycopg.AsIs)
psycopg2.extensions.register_adapter(np.float64, psycopg2._psycopg.AsIs)


def scrape():
    try:
        # Fetch data
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
        data = response.json()["stations"]

        # Prepare DataFrame
        df = pd.read_json(
            StringIO(json.dumps(data, ensure_ascii=False)), dtype={"id": str}
        )
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
        df["timestamp"] = df["timestamp"].astype(str) + "+07"
        df["aqi_index"] = round(df["aqi_index"]).astype(int)
        df["station_name"] = df["station_name"].str.replace("(KK)", "").str.strip()

        # Convert to Python-native types
        df["station_id"] = df["station_id"].astype(str)
        df["aqi_index"] = df["aqi_index"].astype(int)
        df["lat"] = df["lat"].astype(float)
        df["lng"] = df["lng"].astype(float)

        # Add geometry column
        df["geom"] = df.apply(
            lambda row: f"SRID=4326;POINT({row['lng']} {row['lat']})", axis=1
        )

        # Prepare data for insertion
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

        # Insert data into PostgreSQL
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

        load_dotenv("./server/.env")

        conn_params = {
            "dbname": os.getenv("SUPABASE_DB_NAME"),
            "user": os.getenv("SUPABASE_DB_USER"),
            "password": os.getenv("SUPABASE_DB_PASSWORD"),
            "host": os.getenv("SUPABASE_DB_HOST"),
            "port": os.getenv("6543"),
        }

        with psycopg2.connect(**conn_params) as conn:
            with conn.cursor() as cur:
                psycopg2.extras.execute_values(cur, insert_query, values)
            conn.commit()

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


# Export the function
__all__ = ["scrape"]


if __name__ == "__main__":
    scrape()
