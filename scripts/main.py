import logging

from jobs.calculate_aqi import export_data
from jobs.calculate_avg import uploadData
from jobs.scraper import scrape

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    try:
        logger.info("Starting uploading data to database")
        uploadData()
        logger.info("Starting raster conversion process")
        export_data()
        logger.info("Starting scraping conversion process")
        scrape()
    except Exception as e:
        logger.error(f"An error occurred in main process: {e}")
        raise
