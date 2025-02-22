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


DIST_PATH = "assets/data/VN_districts_100m.tif"
dist_ds = gdal.Open(DIST_PATH, gdal.GA_ReadOnly)
ulx, xres, xskew, uly, yskew, yres = dist_ds.GetGeoTransform()
lrx = ulx + (dist_ds.RasterXSize * xres)
lry = uly + (dist_ds.RasterYSize * yres)
TEMP_FILE = "temp.tif"
dist = dist_ds.ReadAsArray()
NODATA_VALUE = -9999
DIST_NODATA = 65535


def process_raster(input_path, output_path):
    """Process a single raster file converting PM2.5 to AQI."""
    try:
        gdal.Warp(
            TEMP_FILE,
            input_path,
            format="GTiff",
            dstSRS="+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs",
            xRes=100,
            yRes=-100,
            outputBounds=(ulx, lry, lrx, uly),
            resampleAlg="near",
            creationOptions=["COMPRESS=LZW"],
        )
        ds = gdal.Open(TEMP_FILE, gdal.GA_ReadOnly)
        data = ds.GetRasterBand(1).ReadAsArray()
        print(data)
        rows, cols = data.shape
        new_data = np.reshape(data, rows * cols)
        new_dist = np.reshape(dist, rows * cols)
        mask = (new_data != NODATA_VALUE) & (new_dist != DIST_NODATA)

        # Create a feature dictionary mapping district IDs to PM2.5 values
        feature_dict = {}
        for dist_id, pm25_value in zip(new_dist[mask], new_data[mask]):
            if dist_id not in feature_dict:
                feature_dict[dist_id] = []
            feature_dict[dist_id].append(pm25_value)

        # Calculate average PM2.5 for each district
        for dist_id in feature_dict:
            avg_value = np.mean(feature_dict[dist_id])
            new_data[new_dist == dist_id] = avg_value

        print(new_data[mask])

        # Create output raster
        driver = gdal.GetDriverByName("GTiff")
        out_ds = driver.Create(
            output_path,
            ds.RasterXSize,
            ds.RasterYSize,
            1,
            gdal.GDT_Float32,
        )
        out_ds.SetGeoTransform(ds.GetGeoTransform())
        out_ds.SetProjection(ds.GetProjection())

        # Reshape new_data back to 2D array
        new_data = np.reshape(new_data, (rows, cols))

        # Write data
        out_band = out_ds.GetRasterBand(1)
        out_band.WriteArray(new_data)
        out_band.SetNoDataValue(-9999)
        out_band.FlushCache()

        # Cleanup
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
