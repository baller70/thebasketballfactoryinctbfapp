
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parse } from 'csv-parse/sync';
import { format } from 'date-fns';

// POST import CSV/JSON data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, type, source } = body;

    if (!data || !type) {
      return NextResponse.json(
        { error: 'Data and type are required' },
        { status: 400 }
      );
    }

    let imported = 0;
    let errors: string[] = [];

    if (type === 'keywords') {
      // Import keywords
      for (const item of data) {
        try {
          const {
            keyword,
            searchVolume,
            difficulty,
            category,
            targetLocation,
            priority,
          } = item;

          if (!keyword) {
            errors.push(`Skipped row: missing keyword`);
            continue;
          }

          await prisma.sEOKeyword.upsert({
            where: { keyword },
            update: {
              searchVolume: searchVolume ? parseInt(searchVolume) : null,
              difficulty: difficulty ? parseInt(difficulty) : null,
              category,
              targetLocation,
              priority: priority ? parseInt(priority) : 5,
            },
            create: {
              keyword,
              searchVolume: searchVolume ? parseInt(searchVolume) : null,
              difficulty: difficulty ? parseInt(difficulty) : null,
              category,
              targetLocation,
              priority: priority ? parseInt(priority) : 5,
            },
          });

          imported++;
        } catch (error: any) {
          errors.push(`Error importing keyword "${item.keyword}": ${error.message}`);
        }
      }
    } else if (type === 'performance') {
      // Import performance/analytics data
      for (const item of data) {
        try {
          const {
            date,
            keyword,
            pagePath,
            impressions,
            clicks,
            ctr,
            position,
            organicTraffic,
            pageViews,
            bounceRate,
            conversions,
          } = item;

          const dateObj = date ? new Date(date) : new Date();
          const dateKey = format(dateObj, 'yyyy-MM-dd');

          // Find keyword if provided
          let keywordId = null;
          if (keyword) {
            const keywordRecord = await prisma.sEOKeyword.findUnique({
              where: { keyword },
            });
            keywordId = keywordRecord?.id || null;
          }

          await prisma.sEOPerformance.create({
            data: {
              keywordId,
              date: dateObj,
              dateKey,
              pagePath,
              impressions: impressions ? parseInt(impressions) : 0,
              clicks: clicks ? parseInt(clicks) : 0,
              ctr: ctr ? parseFloat(ctr) : null,
              position: position ? parseFloat(position) : null,
              organicTraffic: organicTraffic ? parseInt(organicTraffic) : 0,
              pageViews: pageViews ? parseInt(pageViews) : 0,
              bounceRate: bounceRate ? parseFloat(bounceRate) : null,
              conversions: conversions ? parseInt(conversions) : 0,
              source: source || 'manual',
            },
          });

          imported++;
        } catch (error: any) {
          errors.push(`Error importing performance data: ${error.message}`);
        }
      }
    } else if (type === 'competitors') {
      // Import competitor data (NEW)
      for (const item of data) {
        try {
          const {
            name,
            website,
            domainRating,
            organicKeywords,
            organicTraffic,
            referringDomains,
            category,
            notes,
          } = item;

          if (!name || !website) {
            errors.push(`Skipped row: missing name or website`);
            continue;
          }

          // For now, we'll store this in the audit log as we don't have a Competitor table
          // You can create a Competitor table later if needed
          await prisma.sEOAuditLog.create({
            data: {
              action: 'competitor_imported',
              entityType: 'competitor',
              changes: {
                name,
                website,
                domainRating: domainRating ? parseFloat(domainRating) : null,
                organicKeywords: organicKeywords ? parseInt(organicKeywords) : null,
                organicTraffic: organicTraffic ? parseInt(organicTraffic) : null,
                referringDomains: referringDomains ? parseInt(referringDomains) : null,
                category,
                notes,
              },
              performedBy: 'admin',
              success: true,
            },
          });

          imported++;
        } catch (error: any) {
          errors.push(`Error importing competitor "${item.name}": ${error.message}`);
        }
      }
    }

    // Log the import
    await prisma.sEOAuditLog.create({
      data: {
        action: 'data_imported',
        entityType: type,
        changes: {
          imported,
          errors: errors.length,
          source: source || 'manual',
        },
        performedBy: 'admin',
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Failed to import data', details: error.message },
      { status: 500 }
    );
  }
}

// GET import templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const templates: any = {
      keywords: {
        columns: ['keyword', 'searchVolume', 'difficulty', 'category', 'targetLocation', 'priority'],
        example: {
          keyword: 'basketball training sparta nj',
          searchVolume: 140,
          difficulty: 35,
          category: 'local',
          targetLocation: 'Sparta, NJ',
          priority: 8,
        },
      },
      performance: {
        columns: ['date', 'keyword', 'pagePath', 'impressions', 'clicks', 'ctr', 'position', 'organicTraffic', 'pageViews', 'bounceRate', 'conversions'],
        example: {
          date: '2025-11-12',
          keyword: 'basketball training sparta nj',
          pagePath: '/private-lessons',
          impressions: 500,
          clicks: 25,
          ctr: 5.0,
          position: 3.2,
          organicTraffic: 150,
          pageViews: 200,
          bounceRate: 45.5,
          conversions: 5,
        },
      },
      competitors: {
        columns: ['name', 'website', 'domainRating', 'organicKeywords', 'organicTraffic', 'referringDomains', 'category', 'notes'],
        example: {
          name: 'Brian Thomas Basketball',
          website: 'brianthomas-basketball.com',
          domainRating: 4.5,
          organicKeywords: 12,
          organicTraffic: 0,
          referringDomains: 58,
          category: 'direct_competitor',
          notes: 'Local competitor in Morris County',
        },
      },
    };

    if (type && templates[type]) {
      return NextResponse.json({ template: templates[type] });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
