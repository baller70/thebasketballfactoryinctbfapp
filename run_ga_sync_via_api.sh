#!/bin/bash

# Daily Google Analytics Sync via API
# This script calls the production API endpoint to sync GA data

LOG_FILE="/home/ubuntu/seo_automation_logs/daily_ga_sync.log"
ALERT_EMAIL="khouston@thebasketballfactorynj.com"
API_URL="https://thebasketballfactoryinc.com/api/seo/google/sync"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log messages
log_message() {
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" | tee -a "$LOG_FILE"
}

log_message "========================================"
log_message "Starting Daily Google Analytics Sync"
log_message "========================================"

# First, get the sync status to retrieve propertyId and siteUrl
log_message "Fetching sync configuration..."
SYNC_STATUS=$(curl -s "$API_URL")

# Parse the JSON response
PROPERTY_ID=$(echo "$SYNC_STATUS" | grep -o '"propertyId":"[^"]*"' | cut -d'"' -f4)
SITE_URL=$(echo "$SYNC_STATUS" | grep -o '"siteUrl":"[^"]*"' | cut -d'"' -f4)
CONNECTED=$(echo "$SYNC_STATUS" | grep -o '"connected":[^,}]*' | cut -d':' -f2)

log_message "Property ID: $PROPERTY_ID"
log_message "Site URL: $SITE_URL"
log_message "Connected: $CONNECTED"

if [ "$CONNECTED" != "true" ]; then
    log_message "❌ ERROR: Google Analytics not connected"
    log_message "========================================"
    log_message "Daily GA Sync failed - not connected"
    log_message "========================================\n"
    exit 1
fi

if [ -z "$PROPERTY_ID" ] || [ -z "$SITE_URL" ]; then
    log_message "❌ ERROR: Property ID or Site URL not configured"
    log_message "========================================"
    log_message "Daily GA Sync failed - missing configuration"
    log_message "========================================\n"
    exit 1
fi

# Call the sync API
log_message "Syncing last 30 days of data..."
SYNC_RESULT=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"propertyId\":\"$PROPERTY_ID\",\"siteUrl\":\"$SITE_URL\",\"days\":30}")

log_message "Sync result: $SYNC_RESULT"

# Check if sync was successful
SUCCESS=$(echo "$SYNC_RESULT" | grep -o '"success":[^,}]*' | cut -d':' -f2)

if [ "$SUCCESS" = "true" ]; then
    log_message "✅ GA Sync completed successfully"
    
    # Check for warnings
    WARNINGS=$(echo "$SYNC_RESULT" | grep -o '"warnings":\[[^]]*\]')
    if [ -n "$WARNINGS" ]; then
        log_message "Warnings: $WARNINGS"
    fi
    
    log_message "========================================"
    log_message "Daily GA Sync completed successfully"
    log_message "========================================\n"
    exit 0
else
    ERROR_MSG=$(echo "$SYNC_RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    log_message "❌ GA Sync failed"
    log_message "Error: $ERROR_MSG"
    log_message "========================================"
    log_message "Daily GA Sync failed - see errors above"
    log_message "========================================\n"
    exit 1
fi
