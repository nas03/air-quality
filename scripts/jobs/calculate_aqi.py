import datetime
import glob
import os

import numpy as np
import pandas as pd
from osgeo import gdal  # type: ignore

# import shapefile

# input path
input_folder = r"assets/input"
# output path
output_folder = r"assets/out"


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


def export_data():
    for filepath in glob.iglob(os.path.join(input_folder, "*.tif")):
        print(filepath)
        _, filename = os.path.split(filepath)
        output_file = os.path.join(output_folder, filename.replace("PM25", "AQI"))
        ds = gdal.Open(filepath)
        band = ds.GetRasterBand(1)
        pm25_data = band.ReadAsArray()

        aqi_data = np.vectorize(calculate_aqi)(pm25_data)
        # Save AQI data to new GeoTIFF
        driver = gdal.GetDriverByName("GTiff")
        out_ds = driver.Create(
            output_file, ds.RasterXSize, ds.RasterYSize, 1, gdal.GDT_Float32
        )
        out_ds.SetGeoTransform(ds.GetGeoTransform())
        out_ds.SetProjection(ds.GetProjection())

        # Write AQI data to output
        out_band = out_ds.GetRasterBand(1)
        out_band.WriteArray(aqi_data)
        out_band.SetNoDataValue(-9999)  # Set NoData value for missing data
        out_band.FlushCache()

        # Close datasets
        ds = None
        out_ds = None

        print(f"AQI raster saved to {output_file}")


__all__ = ["export_data"]

if __name__ == "__main__":
    export_data()
