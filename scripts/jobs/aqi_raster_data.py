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

# Constants
INPUT_FOLDER = "assets/input"
OUTPUT_FOLDER = "/usr/local/geoserver/data_dir/aqi_map"
DIST_PATH = "assets/data/VN_districts_100m.tif"
TEMP_FILE = "temp.tif"
NODATA_VALUE = -9999
DIST_NODATA = 65535

# Load district reference data
try:
    dist_dataset = gdal.Open(DIST_PATH, gdal.GA_ReadOnly)
    if dist_dataset is None:
        raise Exception(f"Could not open district file: {DIST_PATH}")
    district_data = dist_dataset.ReadAsArray()

    # Extract geospatial parameters
    geotransform = dist_dataset.GetGeoTransform()
    upper_left_x, x_resolution, x_rotation, upper_left_y, y_rotation, y_resolution = (
        geotransform
    )

    # Calculate extent coordinates
    lower_right_x = upper_left_x + (dist_dataset.RasterXSize * x_resolution)
    lower_right_y = upper_left_y + (dist_dataset.RasterYSize * y_resolution)
except Exception as e:
    logger.error(f"Error loading district reference data: {str(e)}")
    raise

# Load environment variables
load_dotenv()
MINIO_HOST = os.getenv("MINIO_HOST")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET = os.getenv("MINIO_BUCKET")


def setup_minio_client() -> Minio:
    """
    Initialize and return a Minio client for object storage.

    Returns:
        Minio: Configured Minio client object
    """
    if not all([MINIO_HOST, MINIO_ACCESS_KEY, MINIO_SECRET_KEY]):
        logger.warning("One or more Minio configuration variables are missing")

    return Minio(
        MINIO_HOST,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False,
    )


def ensure_directory_exists(directory: str) -> None:
    """
    Create directory if it doesn't exist.

    Args:
        directory: Path to the directory to create
    """
    try:
        os.makedirs(directory, exist_ok=True)
        logger.debug(f"Ensured directory exists: {directory}")
    except Exception as e:
        logger.error(f"Failed to create directory {directory}: {str(e)}")
        raise


def validate_with_sampling(input_path, output_path):
    """Check sample points to verify correct AQI calculation"""
    src_ds = gdal.Open(input_path)
    input_data = src_ds.ReadAsArray()

    out_ds = gdal.Open(output_path)
    output_data = out_ds.ReadAsArray()

    # Get dimensions
    rows, cols = input_data.shape

    # Sample size
    n_samples = min(100, rows * cols // 1000)

    # Random sampling
    np.random.seed(42)  # For reproducibility
    sample_rows = np.random.randint(0, rows, n_samples)
    sample_cols = np.random.randint(0, cols, n_samples)

    errors = 0
    for i in range(n_samples):
        r, c = sample_rows[i], sample_cols[i]
        pm25_value = input_data[r, c]

        if pm25_value == NODATA_VALUE:
            continue

        # Calculate expected AQI using your function
        expected_aqi = calculate_aqi(pm25_value)
        actual_aqi = output_data[r, c]

        # Allow for small rounding differences
        if expected_aqi is not None and abs(expected_aqi - actual_aqi) > 1:
            errors += 1
            logger.warning(
                f"AQI mismatch at ({r},{c}): PM2.5={pm25_value}, Expected AQI={expected_aqi}, Actual AQI={actual_aqi}"
            )

    error_rate = errors / n_samples if n_samples > 0 else 0
    logger.info(
        f"Sample validation: {errors} errors in {n_samples} samples ({error_rate:.2%})"
    )

    return error_rate < 0.01  # Less than 1% error rate is acceptable


def createAQIRasterFile(filepath: str, output_path: str):
    """
    Convert PM2.5 raster data to AQI raster data with optimized file size.

    Args:
        filepath: Path to the input PM2.5 raster file
        output_path: Path where the output AQI raster will be saved

    Returns:
        bool: True if processing was successful
    """
    logger.info(f"Processing file: {filepath}")

    try:
        # Get relative paths for file handling
        file_parts = filepath.split("/")
        aqi_filepath = "/".join(file_parts[2:]).replace("PM25", "AQI")
        aqi_filename = "/".join(file_parts[4:]).replace("PM25", "AQI")

        # First, analyze the source file to understand its structure
        src_ds = gdal.Open(filepath, gdal.GA_ReadOnly)
        src_metadata = gdal.Info(src_ds, format="json")
        logger.info(f"Input file size: {os.path.getsize(filepath)/1024:.2f} KB")

        # Use the warp operation with optimized settings
        warp_options = gdal.WarpOptions(
            format="GTiff",
            dstSRS="+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs",
            xRes=100,
            yRes=-100,
            outputBounds=(upper_left_x, lower_right_y, lower_right_x, upper_left_y),
            resampleAlg="near",
            creationOptions=[
                "COMPRESS=DEFLATE",  # Try DEFLATE instead of LZW for better compression
                "PREDICTOR=2",  # Predictor=1 for integer data
                "ZLEVEL=9",  # Maximum compression level
                "TILED=YES",
                "BLOCKXSIZE=256",
                "BLOCKYSIZE=256",
            ],
        )

        temp_ds = gdal.Warp(TEMP_FILE, src_ds, options=warp_options)

        # Read data from temporary file
        data = temp_ds.ReadAsArray()
        rows, cols = data.shape

        # Calculate AQI with vectorized function for efficiency
        output_array = np.full(
            (rows, cols), NODATA_VALUE, dtype=np.int16
        )  # Try int16 instead of int32
        mask = data != NODATA_VALUE

        # Use the smaller appropriate integer data type based on AQI range (0-500)
        # Int16 is sufficient for AQI values and will use half the space of Int32
        vectorized_aqi = np.vectorize(calculate_aqi, otypes=[np.int16])
        output_array[mask] = vectorized_aqi(data[mask])

        # Create output file with optimized creation options
        driver = gdal.GetDriverByName("GTiff")
        out_ds = driver.Create(
            output_path,
            cols,
            rows,
            1,
            gdal.GDT_Int16,  # Use Int16 for AQI values (0-500)
            options=[
                "COMPRESS=DEFLATE",  # Better compression than LZW for many cases
                "PREDICTOR=1",  # For integer data
                "ZLEVEL=9",  # Maximum compression level
                "TILED=YES",
                "BLOCKXSIZE=256",
                "BLOCKYSIZE=256",
                "BIGTIFF=NO",  # Ensure we don't create an unnecessarily large file format
            ],
        )

        # Copy georeferencing information
        out_ds.SetGeoTransform(temp_ds.GetGeoTransform())
        out_ds.SetProjection(temp_ds.GetProjection())

        # Write data
        out_band = out_ds.GetRasterBand(1)
        out_band.WriteArray(output_array)
        out_band.SetNoDataValue(NODATA_VALUE)
        out_band.SetDescription("Air Quality Index")

        # Add color interpretation and metadata
        out_ds.SetMetadataItem("PARAMETER", "AQI")
        out_ds.SetMetadataItem("PARAMETER_UNIT", "AQI")
        out_ds.SetMetadataItem("STATISTICS_MINIMUM", "0")
        out_ds.SetMetadataItem("STATISTICS_MAXIMUM", "500")

        # Flush and close all resources
        out_band.FlushCache()
        out_ds = None
        temp_ds = None
        src_ds = None

        # Log the file size before upload for comparison
        output_size_kb = os.path.getsize(output_path) / 1024
        logger.info(
            f"Output file size: {output_size_kb:.2f} KB (compression ratio: {os.path.getsize(filepath)/output_size_kb:.2f}x)"
        )

        with open(output_path, "rb") as f:
            files = [("file", (aqi_filename, f, "image/tiff"))]
            requests.post(
                f"http://localhost:5500/api/files/",
                files=files,
                data={"filename": aqi_filepath},
            )

        # Cleanup
        os.remove(TEMP_FILE)
        logger.info(f"Successfully created output file: {output_path}")
        try:
            samples_valid = validate_with_sampling(filepath, output_path)
            if not samples_valid:
                logger.warning("Sample validation indicates calculation errors")
        except Exception as e:
            logger.error(f"Sample validation failed: {str(e)}")
        return True

    except Exception as e:
        logger.error(f"Error processing file {filepath}: {str(e)}")
        if os.path.exists(TEMP_FILE):
            os.remove(TEMP_FILE)
        return False


def get_file_paths_for_date(date: datetime.datetime) -> Tuple[str, str, str]:
    """Generate file paths for a specific date."""
    mini_bucket_path = date.strftime("%Y/%m/%d")
    path = date.strftime("%Y/%m")
    nrt_file_name = f"PM25_{date.strftime('%Y%m%d')}_3kmNRT.tif"
    dir_path = os.path.join(INPUT_FOLDER, path)
    file_path = os.path.join(dir_path, nrt_file_name)

    return mini_bucket_path, file_path, nrt_file_name


def download_file(client: Minio, date: datetime.datetime) -> Optional[str]:
    """Download a PM2.5 file for the given date."""
    mini_bucket_path, file_path, nrt_file_name = get_file_paths_for_date(date)
    dir_path = os.path.dirname(file_path)

    try:
        ensure_directory_exists(dir_path)

        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed existing file: {file_path}")

        logger.info(f"Attempting to download file for {date.strftime('%Y-%m-%d')}")
        client.fget_object(
            MINIO_BUCKET,
            f"{mini_bucket_path}/{nrt_file_name}",
            file_path,
        )
        logger.info(f"Successfully downloaded {nrt_file_name}")
        return file_path
    except Exception as e:
        logger.error(
            f"Failed to download file for {date.strftime('%Y-%m-%d')}: {str(e)}"
        )
        return None


def download_files(client: Minio, date_range: List[datetime.datetime]) -> List[str]:
    """Download PM2.5 files for the given date range."""
    ensure_directory_exists(INPUT_FOLDER)
    return [
        path
        for path in map(lambda date: download_file(client, date), date_range)
        if path
    ]


def lerp(
    aqi_low: int, aqi_high: int, conc_low: float, conc_high: float, conc: float
) -> float:
    """Linear interpolation function with division by zero check."""
    if conc_high == conc_low:
        return 0
    return aqi_low + (conc - conc_low) * (aqi_high - aqi_low) / (conc_high - conc_low)


def calculate_aqi(pm25: float) -> Optional[int]:
    """Convert PM2.5 concentration to AQI."""
    if np.isnan(pm25):
        return None

    c = round(pm25 * 10) / 10

    if c < 0:
        return 0
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
        return 500


def get_output_path(input_path: str) -> str:
    """Generate output path from input path."""
    dir_name = os.path.dirname(input_path)
    file_name = os.path.basename(input_path)
    output_dir = dir_name.replace(INPUT_FOLDER, OUTPUT_FOLDER)
    output_file = file_name.replace("PM25", "AQI")
    output_path = os.path.join(output_dir, output_file)

    ensure_directory_exists(output_dir)
    return output_path


def notify_geoserver(output_folder: str) -> None:
    """Notify GeoServer about the new data."""
    geoserver_host = os.getenv("GEOSERVER_HOST", "localhost:8080")
    geoserver_user = os.getenv("GEOSERVER_USER", "admin")
    geoserver_password = os.getenv("GEOSERVER_PASSWORD", "geoserver")
    geoserver_workspace = os.getenv("GEOSERVER_WORKSPACE", "air")
    geoserver_store = os.getenv("GEOSERVER_STORE", "aqi_map")

    url = f"http://{geoserver_host}/geoserver/rest/workspaces/{geoserver_workspace}/coveragestores/{geoserver_store}/external.imagemosaic"
    headers = {"Content-type": "text/plain"}
    auth = (geoserver_user, geoserver_password)
    data = f"{output_folder}"

    try:
        response = requests.post(url, headers=headers, auth=auth, data=data)
        if response.status_code in [200, 201]:
            logger.info(f"Successfully notified GeoServer: {response.status_code}")
        else:
            logger.warning(
                f"GeoServer notification: {response.status_code} - {response.text}"
            )
    except Exception as e:
        logger.error(f"Error notifying GeoServer: {str(e)}")


def process_single_file(input_path: str) -> bool:
    """Process a single file from input to output."""
    output_path = get_output_path(input_path)
    raster_info = createAQIRasterFile(input_path, output_path)
    return True


def generate_date_range(days: int) -> List[datetime.datetime]:
    """Generate a list of dates starting from today."""
    current_date = datetime.datetime.now()
    return [current_date + datetime.timedelta(days=i) for i in range(days)]


def cleanup_downloaded_files(file_paths: List[str]) -> None:
    """Delete downloaded files to free up disk space."""
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted file: {file_path}")
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {str(e)}")


def scrape_aqi_data() -> None:
    """Main function to export AQI data."""
    try:
        logger.info("Starting AQI export process")

        # Setup and load data
        minio_client = setup_minio_client()

        # Generate date range and download files
        date_range = generate_date_range(8)  # Current date + next 7 days
        downloaded_files = download_files(minio_client, date_range)

        # Process files to create AQI raster files using the uploadData function
        logger.info("Starting AQI data processing with uploadData")
        scrape_district_avg_data(input_files=downloaded_files)

        # Process files for GeoServer
        logger.info("Starting AQI image processing for GeoServer")
        process_func = partial(process_single_file)
        results = list(map(process_func, downloaded_files))

        success_count = sum(results)
        logger.info(
            f"Export complete. Processed {success_count}/{len(downloaded_files)} files successfully"
        )

        notify_geoserver(OUTPUT_FOLDER)

        # Clean up downloaded files after processing
        logger.info("Cleaning up downloaded files")
        cleanup_downloaded_files(downloaded_files)
    except Exception as e:
        logger.error(f"An unexpected error occurred during export: {str(e)}")
        raise


__all__ = ["scrape_aqi_data"]

if __name__ == "__main__":
    scrape_aqi_data()
    notify_geoserver(OUTPUT_FOLDER)
