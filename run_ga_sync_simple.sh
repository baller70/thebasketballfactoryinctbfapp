#!/bin/bash

# Simple Daily GA Sync Runner
# This script triggers the GA sync by calling the Next.js API endpoint

LOG_FILE="/home/ubuntu/seo_automation_logs/daily_ga_sync.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
DATE_STR=$(date -u +"%Y-%m-%d")

# Ensure log directory exists
mkdir -p /home/ubuntu/seo_automation_logs

# Log start
echo "========================================" >> "$LOG_FILE"
echo "Starting Daily Google Analytics Sync" >> "$LOG_FILE"
echo "Timestamp: $TIMESTAMP" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Check if Next.js app is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "ERROR: Next.js app is not running on localhost:3000" >> "$LOG_FILE"
    echo "Please start the app with: cd /home/ubuntu/rise_as_one_aau/nextjs_space && npm run dev" >> "$LOG_FILE"
    echo "========================================" >> "$LOG_FILE"
    exit 1
fi

# Get SEO settings to extract property ID and site URL
SETTINGS=$(curl -s http://localhost:3000/api/seo/google/sync)

if echo "$SETTINGS" | grep -q '"connected":true'; then
    PROPERTY_ID=$(echo "$SETTINGS" | grep -o '"propertyId":"[^"]*"' | cut -d'"' -f4)
    SITE_URL=$(echo "$SETTINGS" | grep -o '"siteUrl":"[^"]*"' | cut -d'"' -f4)
    
    echo "Configuration validated" >> "$LOG_FILE"
    echo "Property ID: $PROPERTY_ID" >> "$LOG_FILE"
    echo "Search Console URL: $SITE_URL" >> "$LOG_FILE"
    echo "Fetching last 30 days of GA and GSC data..." >> "$LOG_FILE"
    
    # Trigger the sync
    RESULT=$(curl -s -X POST http://localhost:3000/api/seo/google/sync \
        -H "Content-Type: application/json" \
        -d "{\"propertyId\":\"$PROPERTY_ID\",\"siteUrl\":\"$SITE_URL\",\"days\":30}")
    
    if echo "$RESULT" | grep -q '"success":true'; then
        echo "✅ SUCCESS: GA sync completed successfully" >> "$LOG_FILE"
        echo "Message: Data synced successfully" >> "$LOG_FILE"
        
        # Extract metrics if available
        if echo "$RESULT" | grep -q '"metrics"'; then
            echo "Metrics synced successfully" >> "$LOG_FILE"
        fi
        
        # Check for warnings
        if echo "$RESULT" | grep -q '"warnings"'; then
            WARNINGS=$(echo "$RESULT" | grep -o '"warnings":\[[^]]*\]')
            echo "Warnings: $WARNINGS" >> "$LOG_FILE"
        fi
        
        echo "Audit log entry created" >> "$LOG_FILE"
        echo "========================================" >> "$LOG_FILE"
        echo "Daily GA Sync Task Completed" >> "$LOG_FILE"
        echo "========================================" >> "$LOG_FILE"
        exit 0
    else
        ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
        echo "❌ FAILED: $ERROR_MSG" >> "$LOG_FILE"
        echo "========================================" >> "$LOG_FILE"
        
        # Send alert email (placeholder - would need actual email sending)
        echo "Alert: GA sync failed - $ERROR_MSG" >> "$LOG_FILE"
        exit 1
    fi
else
    echo "ERROR: Google Analytics not configured" >> "$LOG_FILE"
    echo "========================================" >> "$LOG_FILE"
    exit 1
fi
