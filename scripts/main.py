import logging

from jobs.aqi_raster_data import scrape_aqi_data
from jobs.stations_data import scrape_stations_data
from jobs.wind_data import scrape_wind_data

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s -w %(message)s"
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    try:
        logger.info("Starting scraping aqi_data")
        scrape_aqi_data()
        logger.info("Starting scraping station_data")
        scrape_stations_data()
        logger.info("Starting scraping wind_data")
        scrape_wind_data()
    except Exception as e:
        logger.error(f"An error occurred in main process: {e}")
        raise
