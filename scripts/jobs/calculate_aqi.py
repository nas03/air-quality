import datetime
import glob
import logging
import os

import numpy as np
import pandas as pd
from osgeo import gdal  # type: ignore

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Input/output paths
input_folder = r"assets/input"
output_folder = r"assets/output"


def lerp(aqi_low, aqi_high, conc_low, conc_high, conc):
    """Linear interpolation function with division by zero check."""
    if conc_high == conc_low:
        return 0
    return aqi_low + (conc - conc_low) * (aqi_high - aqi_low) / (conc_high - conc_low)


def calculate_aqi(pm25):
    """Convert PM2.5 concentration to AQI."""
    if np.isnan(pm25):
        return None

    c = round(pm25 * 10) / 10

    # AQI breakpoints and corresponding calculations
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


def process_raster(input_path, output_path):
    """Process a single raster file converting PM2.5 to AQI."""
    try:
        ds = gdal.Open(input_path)
        if not ds:
            logger.error(f"Failed to open raster file: {input_path}")
            return False

        band = ds.GetRasterBand(1)
        pm25_data = band.ReadAsArray()
        aqi_data = np.vectorize(calculate_aqi)(pm25_data)

        # Create output raster
        driver = gdal.GetDriverByName("GTiff")
        out_ds = driver.Create(
            output_path, ds.RasterXSize, ds.RasterYSize, 1, gdal.GDT_Float32
        )
        out_ds.SetGeoTransform(ds.GetGeoTransform())
        out_ds.SetProjection(ds.GetProjection())

        # Write data
        out_band = out_ds.GetRasterBand(1)
        out_band.WriteArray(aqi_data)
        out_band.SetNoDataValue(-9999)
        out_band.FlushCache()

        # Cleanup
        ds = None
        out_ds = None

        logger.info(f"Successfully processed: {output_path}")
        return True

    except Exception as e:
        logger.error(f"Error processing {input_path}: {str(e)}")
        return False


def export_data():
    """Export PM2.5 data to AQI format."""
    try:
        logger.info("Starting AQI export process")

        success_count = 0
        total_count = 0

        for filepath in glob.iglob(os.path.join(input_folder, "*.tif")):
            total_count += 1
            _, filename = os.path.split(filepath)
            output_file = os.path.join(output_folder, filename.replace("PM25", "AQI"))

            if process_raster(filepath, output_file):
                success_count += 1

        logger.info(
            f"Export complete. Processed {success_count}/{total_count} files successfully"
        )

    except Exception as e:
        logger.error(f"An unexpected error occurred during export: {str(e)}")
        raise


__all__ = ["export_data"]

if __name__ == "__main__":
    export_data()
