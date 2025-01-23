import datetime
import glob
import os

import numpy as np
import pandas as pd
from osgeo import gdal  # type: ignore


# import shapefile
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


# input path
folder_geotiff_path = r"assets/data"
# output path
folder_csv_path = r"assets/output"

meta_path = r"src/scripts/data/districtsVN.xlsx"
meta = pd.read_excel(meta_path)

dist_path = r"src/scripts/data/VN_districts_100m.tif"
dist_ds = gdal.Open(dist_path, gdal.GA_ReadOnly)
dist = dist_ds.ReadAsArray()  # nodata 65535

ulx, xres, xskew, uly, yskew, yres = dist_ds.GetGeoTransform()
lrx = ulx + (dist_ds.RasterXSize * xres)
lry = uly + (dist_ds.RasterYSize * yres)

year = "2024"
year_log = []

for filepath in glob.iglob(os.path.join(folder_geotiff_path, "*.tif")):
    print(filepath)
    _, filename = os.path.split(filepath)

    year = filename.split("_")[1][0:4]
    month = filename.split("_")[1][4:6]
    day = filename.split("_")[1][6:8]
    timeInfo = datetime.datetime(int(year), int(month), int(day))

    temp_fpath = "temp.tif"

    gdal.Warp(
        temp_fpath,
        filepath,
        format="GTiff",
        dstSRS="+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs",
        xRes=100,
        yRes=-100,
        outputBounds=(ulx, lry, lrx, uly),
        resampleAlg="near",
        creationOptions=["COMPRESS=LZW"],
    )

    data = gdal.Open(temp_fpath, gdal.GA_ReadOnly).ReadAsArray()
    # print(data)
    rows, cols = data.shape

    new_data = np.reshape(data, rows * cols)
    new_dist = np.reshape(dist, rows * cols)

    mask = (new_data != -9999) & (new_dist != 65535)

    new_data = new_data[mask]
    new_dist = new_dist[mask]

    df = pd.DataFrame({"dist_ID": new_dist, "pm_25": new_data})
    df = df.groupby("dist_ID", as_index=False).mean()
    df = df.dropna(subset=["pm_25"])
    df["aqi_index"] = df["pm_25"].apply(calculate_aqi)
    df["time"] = timeInfo
    df = df[["time", "dist_ID", "pm_25", "aqi_index"]]

    # print(meta)
    sub_meta = meta[["ID", "GID_2"]]
    sub_meta = sub_meta.rename(columns={"ID": "dist_ID", "GID_2": "GID_2"})
    df = pd.merge(df, sub_meta)
    df = df.rename(columns={"GID_2": "district_id"})
    df = df.drop(columns=["dist_ID"])
    df = df[["district_id", "pm_25", "aqi_index", "time"]]
    year_log.append(df)
    os.remove(temp_fpath)

    # break
year_df = pd.concat(year_log)
year_df.to_csv(folder_csv_path + f"/data.csv", index=False)
