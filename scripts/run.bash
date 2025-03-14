#!/bin/bash

# Activate virtual environment if using one
# source venv/bin/activate

echo "Running cron jobs"
python jobs/scraping.py
echo "Done!"
