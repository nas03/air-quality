#!/bin/bash

# Activate virtual environment if using one
# source venv/bin/activate

echo "Running cron jobs"
cd ~/air-quality/scripts
python jobs/scraping.py
echo "Done!"