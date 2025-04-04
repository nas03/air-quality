import datetime
import logging

import requests
from jobs.aqi_raster_data import scrape_aqi_data
from jobs.stations_data import scrape_stations_data
from jobs.wind_data import scrape_wind_data

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s -w %(message)s"
)
logger = logging.getLogger(__name__)


def send_notifications(station_data_log, wind_data_log):

    data = {
        "raster_data_status": 1,
        "station_data_status": 1 if station_data_log["success"] == True else 0,
        "wind_data_status": 1 if wind_data_log["success"] == True else 0,
        "wind_data_log": wind_data_log["log"],
        "station_data_log": station_data_log["log"],
        "timestamp": datetime.datetime.now().isoformat(),
    }

    response = requests.post(
        "http://ec2-52-221-181-109.ap-southeast-1.compute.amazonaws.com:5500/api/cronjob/record",
        data=data,
    )
    print(response.json())


if __name__ == "__main__":
    try:
        logger.info("Starting scraping aqi_data")
        scrape_aqi_data()
        logger.info("Starting scraping station_data")
        station_data_log = scrape_stations_data()
        logger.info("Starting scraping wind_data")
        wind_data_log = scrape_wind_data()
        send_notifications(station_data_log, wind_data_log)
    except Exception as e:
        logger.error(f"An error occurred in main process: {e}")
        raise
