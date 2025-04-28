#!/bin/bash

# === Configuration ===
# AWS S3 bucket name
S3_BUCKET="uet-airq"
# Base local directory to store downloaded files
OUTPUT_BASE_DIR="/usr/local/geoserver/data_dir/aqi_map"
# Number of days to process, starting from today (e.g., 5 means today + next 4 days)
DAYS_TO_PROCESS=8
# AWS CLI profile to use (optional, remove or leave empty to use default)
# AWS_PROFILE="your-profile-name"
# =====================

# --- Script Logic ---

# Function to add AWS profile option if specified
aws_opts=""
if [ -n "$AWS_PROFILE" ]; then
  aws_opts="--profile $AWS_PROFILE"
fi

echo "Starting S3 download process..."
echo "Bucket: $S3_BUCKET"
echo "Output Base Directory: $OUTPUT_BASE_DIR"
echo "Processing $DAYS_TO_PROCESS days starting from today."
echo "---"

# Loop for the specified number of days
for i in $(seq 0 $((DAYS_TO_PROCESS - 1))); do
    # Calculate the target date using GNU 'date -d' for date arithmetic
    # Format as YYYY-MM-DD first for easier parsing below
    TARGET_DATE_STR=$(date -d "+${i} days" +"%Y-%m-%d")

    echo "Processing date: $TARGET_DATE_STR"

    # Extract year, month, and YYYYMMDD format using GNU 'date' formatting
    YEAR=$(date -d "$TARGET_DATE_STR" +"%Y")
    MONTH=$(date -d "$TARGET_DATE_STR" +"%m")
    DAY_FORMAT=$(date -d "$TARGET_DATE_STR" +"%Y%m%d")

    # Construct the S3 object key (path within the bucket)
    S3_OBJECT_KEY="$YEAR/$MONTH/AQI_${DAY_FORMAT}_3kmNRT.tif"
    # Construct the full S3 URI
    S3_URI="s3://$S3_BUCKET/$S3_OBJECT_KEY"

    # Construct the local output directory and full file path
    LOCAL_OUTPUT_DIR="$OUTPUT_BASE_DIR/$YEAR/$MONTH"
    LOCAL_OUTPUT_FILEPATH="$LOCAL_OUTPUT_DIR/AQI_${DAY_FORMAT}_3kmNRT.tif"

    echo "  S3 Source: $S3_URI"
    echo "  Local Destination: $LOCAL_OUTPUT_FILEPATH"

    # Create the local output directory if it doesn't exist
    # The '-p' flag ensures parent directories are also created and suppresses errors if it already exists
    echo "  Ensuring local directory exists: $LOCAL_OUTPUT_DIR"
    mkdir -p "$LOCAL_OUTPUT_DIR"
    if [ $? -ne 0 ]; then
        echo "  Error: Failed to create directory $LOCAL_OUTPUT_DIR. Skipping this date."
        echo "---"
        continue # Skip to the next date
    fi

    # Download the file using AWS CLI 's3 cp' command
    # '--only-show-errors' suppresses progress bars, only showing actual errors
    echo "  Attempting download..."
    aws s3 cp "$S3_URI" "$LOCAL_OUTPUT_FILEPATH" --only-show-errors $aws_opts

    # Check the exit status of the aws command
    if [ $? -eq 0 ]; then
        echo "  Successfully downloaded."
    else
        # Log an error message. Common issues include:
        # - File not found in S3
        # - Insufficient AWS permissions
        # - Incorrect AWS CLI configuration (credentials/region)
        echo "  Error: Failed to download $S3_URI."
        echo "  Please check AWS CLI configuration, permissions, and if the S3 object exists."
    fi
    echo "---"

done

echo "S3 download process finished."

# === GeoServer Notification ===

# Function to notify GeoServer about new data
notify_geoserver() {
    local output_folder="$1"
    local geoserver_host="${GEOSERVER_HOST:-localhost:8080}"
    local geoserver_user="${GEOSERVER_USER:-admin}"
    local geoserver_password="${GEOSERVER_PASSWORD:-geoserver}"
    local geoserver_workspace="${GEOSERVER_WORKSPACE:-air}"
    local geoserver_store="${GEOSERVER_STORE:-aqi_map}"

    local url="http://${geoserver_host}/geoserver/rest/workspaces/${geoserver_workspace}/coveragestores/${geoserver_store}/external.imagemosaic"

    echo "Notifying GeoServer at $url..."

    # Use curl to send the POST request
    # -s: Silent mode
    # -u: Basic authentication
    # -X POST: Specify POST method
    # -H: Set header
    # -d: Set request body (data)
    # -w "%{http_code}": Output only the HTTP status code
    # -o /dev/null: Redirect response body to null
    http_status=$(curl -s -u "${geoserver_user}:${geoserver_password}" \
                     -X POST \
                     -H "Content-type: text/plain" \
                     -d "${output_folder}" \
                     -w "%{http_code}" \
                     -o /dev/null \
                     "$url")

    # Check the HTTP status code
    if [[ "$http_status" -eq 200 || "$http_status" -eq 201 ||  "$http_status" -eq 202 ]]; then
        echo "Successfully notified GeoServer (Status: $http_status)."
    else
        echo "Warning: GeoServer notification failed (Status: $http_status)."
        # Optionally, attempt to get error message (might require removing -o /dev/null and capturing output)
        # response_body=$(curl -s -u "${geoserver_user}:${geoserver_password}" -X POST -H "Content-type: text/plain" -d "${output_folder}" "$url")
        # echo "GeoServer response: $response_body"
    fi
}

# Call the notification function after downloads are complete
# Pass the base output directory used for downloads
notify_geoserver "$OUTPUT_BASE_DIR"

echo "GeoServer notification attempt finished."