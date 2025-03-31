#!/usr/bin/env python3
"""
A simple API server that executes a cron job when called.
Using console logging instead of file logging.
"""
import subprocess
import logging
import sys
from flask import Flask, jsonify
from datetime import datetime

# Configure logging to console instead of file
logging.basicConfig(
    stream=sys.stdout,
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = Flask(__name__)


@app.route("/ping", methods=["GET"])
def ping():
    """
    Simple ping endpoint to test connectivity.
    """
    return jsonify(
        {
            "status": "success",
            "message": "pong",
            "timestamp": datetime.now().isoformat(),
        }
    )


@app.route("/execute-cron", methods=["POST"])
def execute_cron():
    """
    Endpoint to execute the cron job.
    """
    try:
        # Log the request
        logging.info(f"Executing cron job at {datetime.now()}")

        # Execute the command
        result = subprocess.run(
            "cd /etc/cron.daily && ./run.bash >> ~/myscript.log 2>&1",
            shell=True,
            capture_output=True,
            text=True,
        )

        # Check if the command executed successfully
        if result.returncode == 0:
            logging.info("Cron job executed successfully")
            return jsonify(
                {
                    "status": "success",
                    "message": "Cron job executed successfully",
                    "timestamp": datetime.now().isoformat(),
                }
            )
        else:
            logging.error(f"Cron job failed with error: {result.stderr}")
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Cron job execution failed",
                        "error": result.stderr,
                        "timestamp": datetime.now().isoformat(),
                    }
                ),
                500,
            )

    except Exception as e:
        logging.exception(f"Exception occurred: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "An exception occurred while executing the cron job",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat(),
                }
            ),
            500,
        )


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="API server to execute cron jobs")
    parser.add_argument(
        "--port", type=int, default=5000, help="Port to run the server on"
    )
    parser.add_argument(
        "--host", type=str, default="0.0.0.0", help="Host to run the server on"
    )
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")

    args = parser.parse_args()

    logging.info(f"Starting server on {args.host}:{args.port} with debug={args.debug}")

    # Set to 0.0.0.0 to bind to all network interfaces
    app.run(host="0.0.0.0", port=args.port, debug=args.debug)
