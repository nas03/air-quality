#!/bin/bash

cd ~/air-quality
git checkout release && git pull
cp scripts/monitoring_service.py /opt/scripts/cron_api.py

sudo systemctl daemon-reload
sudo systemctl restart cron-api.service
sudo systemctl status cron-api.service
