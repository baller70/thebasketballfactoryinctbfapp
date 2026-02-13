# Weekly Technical SEO Checks - Quick Reference Guide

## Overview

This automated task performs weekly technical SEO checks including broken link detection and sitemap generation.

**Schedule:** Every Sunday at 3:00 AM UTC  
**Duration:** ~2-5 seconds  
**Status:** ✅ Active

---

## What It Does

1. **Checks for Broken Links**
   - Scans all active pages in the SEO configuration
   - Tests each URL with HTTP HEAD requests
   - Identifies 404 errors and network issues

2. **Generates Sitemap**
   - Creates XML sitemap from SEO page configuration
   - Includes priority and change frequency
   - Updates the public sitemap.xml file

3. **Logs Results**
   - Records all findings to technical_checks.log
   - Creates detailed broken links report if issues found
   - Evaluates alert threshold (5+ broken links)

---

## Manual Execution

To run the technical SEO checks manually:

```bash
cd /home/ubuntu/rise_as_one_aau/nextjs_space
npx tsx ../maintenance_scripts/run_technical_seo_checks.ts
```

---

## Output Files

### 1. Broken Links Report
**Location:** `/home/ubuntu/seo_automation_logs/broken_links_<date>.md`  
**Format:** Markdown  
**Created:** Only when broken links are found  
**Contains:**
- List of broken URLs
- HTTP status codes
- Page names where links were found

### 2. Sitemap XML
**Location:** `/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml`  
**Format:** XML (Sitemap Protocol 0.9)  
**Updated:** Every run  
**Contains:**
- All active page URLs
- Last modified dates
- Change frequencies
- Priority values

### 3. Technical Checks Log
**Location:** `/home/ubuntu/seo_automation_logs/technical_checks.log`  
**Format:** Text log  
**Updated:** Every run  
**Contains:**
- Timestamp
- Pages checked count
- Broken links count
- Sitemap generation status

---

## Alert System

**Threshold:** 5 or more broken links  
**Action:** Email alert to khouston@thebasketballfactorynj.com  
**Status:** Configured (requires SMTP setup)

When the threshold is exceeded:
- Alert is logged to console
- Email notification would be sent (if SMTP configured)
- Detailed broken links report is generated

---

## Database Schema

The script uses the `SEOPageConfig` model:

```typescript
{
  pagePath: string          // e.g., "/", "/private-lessons"
  pageName: string          // Friendly name
  status: string            // "active", "paused", "archived"
  updateFrequency: string   // "daily", "weekly", "monthly"
  updatedAt: DateTime       // Last update timestamp
}
```

---

## Troubleshooting

### All Pages Return 404

**Symptom:** All checked pages show 404 status  
**Possible Causes:**
- Production site is down
- Deployment URL has changed
- DNS issues

**Solution:**
1. Verify production site is accessible
2. Check deployment status
3. Update base URL in script if needed

### Script Fails to Run

**Symptom:** Error when executing script  
**Possible Causes:**
- Database connection issues
- Missing dependencies
- Prisma client not generated

**Solution:**
```bash
cd /home/ubuntu/rise_as_one_aau/nextjs_space
npm install
npx prisma generate
npx tsx ../maintenance_scripts/run_technical_seo_checks.ts
```

### Sitemap Not Generated

**Symptom:** sitemap.xml file not created/updated  
**Possible Causes:**
- No active pages in database
- File permission issues
- Script execution error

**Solution:**
1. Check database for active SEO pages
2. Verify write permissions on public directory
3. Check script execution logs

---

## Configuration

### Base URL
Current: `https://riseasoneau.abacusai.app`

To change the base URL, edit the script:
```typescript
const baseUrl = 'https://your-new-domain.com';
```

### Alert Threshold
Current: 5 broken links

To change the threshold, edit the script:
```typescript
if (brokenLinks.length > 5) {  // Change this number
  // Alert logic
}
```

### Alert Email
Current: `khouston@thebasketballfactorynj.com`

To change the email, edit the script:
```typescript
console.log('Email alert would be sent to: your-email@example.com');
```

---

## Recent Execution History

| Date | Pages Checked | Broken Links | Sitemap Generated | Status |
|------|---------------|--------------|-------------------|--------|
| 2025-12-14 | 4 | 4 | Yes | ✅ Complete |
| 2025-11-30 | 4 | 0 | Yes | ✅ Complete |
| 2025-11-24 | 4 | 0 | Yes | ✅ Complete |
| 2025-11-23 | 4 | 0 | Yes | ✅ Complete |
| 2025-11-16 | 4 | 0 | Yes | ✅ Complete |

---

## Integration with SEO System

This task is part of the comprehensive SEO automation system:

- **Daily Tasks:** Google Analytics sync, social media posting
- **Weekly Tasks:** Technical SEO checks, keyword tracking, SEO reports
- **Monthly Tasks:** Content optimization, backlink monitoring

All tasks log to `/home/ubuntu/seo_automation_logs/` for centralized monitoring.

---

## Next Steps

1. **Investigate 404 Errors**
   - Check production site status
   - Verify deployment URL
   - Test pages manually

2. **Configure Email Alerts**
   - Set up SMTP credentials
   - Test email delivery
   - Add additional recipients if needed

3. **Enhance Monitoring**
   - Add response time tracking
   - Monitor sitemap submission to search engines
   - Track broken link trends over time

---

## Support

For issues or questions:
- Check logs in `/home/ubuntu/seo_automation_logs/`
- Review script at `/home/ubuntu/rise_as_one_aau/maintenance_scripts/run_technical_seo_checks.ts`
- Verify database connection and SEO page configuration

---

*Last Updated: 2025-12-14*  
*Script Version: 1.0*  
*Status: Active*
