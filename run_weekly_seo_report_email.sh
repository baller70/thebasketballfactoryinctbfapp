#!/bin/bash

# Weekly SEO Report Email - Scheduled Task Runner
# This script sends a comprehensive weekly SEO performance report via email
# Schedule: Every Monday at 8 AM

set -e

echo "=========================================="
echo "Weekly SEO Report Email Task"
echo "Started: $(date)"
echo "=========================================="

# Change to the nextjs_space directory
cd /home/ubuntu/rise_as_one_aau/nextjs_space

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run the email sender script
node send_weekly_seo_report_email.mjs

echo "=========================================="
echo "Task completed: $(date)"
echo "=========================================="
