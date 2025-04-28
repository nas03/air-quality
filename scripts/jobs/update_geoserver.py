import array
import datetime
import logging
import os
from functools import partial
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import requests
from dotenv import load_dotenv
from minio import Minio  # type: ignore
from osgeo import gdal  # type: ignore

from districts_avg_data import scrape_district_avg_data  # type: ignore

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

OUTPUT_FOLDER = "/usr/local/geoserver/data_dir/aqi_map"

# Load environment variables from .env file
load_dotenv()

# Initialize Minio client for AWS S3
minio_client = Minio(
    os.getenv("MINIO_ENDPOINT", "s3.amazonaws.com"),  # Default to AWS S3 endpoint
    access_key=os.getenv("AWS_ACCESS_KEY_ID"),
    secret_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    secure=True,  # Use HTTPS for AWS S3
)
minio_bucket = "uet-airq"  # Use the specified bucket name


def generate_date_range(days: int) -> List[datetime.datetime]:
    """Generate a list of dates starting from today."""
    current_date = datetime.datetime.now()
    return [current_date + datetime.timedelta(days=i) for i in range(days)]


def download_file(date: datetime.datetime):
    """Download AQI file from S3 for a specific date."""
    path = date.strftime("%Y/%m")
    s3_filename = f"AQI_{date.strftime('%Y%m%d')}_3kmNRT.tif"
    s3_filepath = f"{path}/{s3_filename}"  # Corrected path separator
    output_dir = os.path.join(OUTPUT_FOLDER, path)
    output_filepath = os.path.join(output_dir, s3_filename)

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    logger.info(
        f"Attempting to download {s3_filepath} from bucket {minio_bucket} to {output_filepath}"
    )
    try:
        minio_client.fget_object(minio_bucket, s3_filepath, output_filepath)
        logger.info(f"Successfully downloaded {s3_filepath} to {output_filepath}")
    except Exception as e:
        logger.error(f"Failed to download {s3_filepath}: {e}")


def main(days_to_process: int = 5):
    """Generate date range and download files for each date."""
    dates = generate_date_range(days_to_process)
    logger.info(
        f"Generated dates for processing: {[d.strftime('%Y-%m-%d') for d in dates]}"
    )
    for date in dates:
        download_file(date)


if __name__ == "__main__":
    # Example: Process data for the next 5 days (including today)
    main(days_to_process=5)
