#!/bin/bash

# Activate virtual environment if using one
# source venv/bin/activate

# Run the Python scripts
echo "Running scraper..."
python scripts/scraper.py

echo "Running calculate_avg..."
python scripts/calculate_avg.py

echo "Done!"
