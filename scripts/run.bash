#!/bin/bash

# Activate virtual environment if using one
# source venv/bin/activate

echo "Running cron jobs"
python scripts/main.py
echo "Done!"
