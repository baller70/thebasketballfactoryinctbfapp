
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all SEO keywords
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (category) where.category = category;
    if (isActive !== null) where.isActive = isActive === 'true';

    const keywords = await prisma.sEOKeyword.findMany({
      where,
      include: {
        performanceData: {
          orderBy: { date: 'desc' },
          take: 30, // Last 30 days
        },
      },
      orderBy: [
        { priority: 'desc' },
        { searchVolume: 'desc' },
      ],
    });

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error fetching SEO keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

// POST create new keyword
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      keyword,
      targetLocation,
      searchVolume,
      difficulty,
      priority = 5,
      category,
      isActive = true,
    } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    const newKeyword = await prisma.sEOKeyword.create({
      data: {
        keyword,
        targetLocation,
        searchVolume,
        difficulty,
        priority,
        category,
        isActive,
      },
    });

    // Log the action
    await prisma.sEOAuditLog.create({
      data: {
        action: 'keyword_added',
        entityType: 'keyword',
        entityId: newKeyword.id,
        changes: { keyword },
        performedBy: 'admin', // You can replace with actual user ID
        success: true,
      },
    });

    return NextResponse.json({ keyword: newKeyword }, { status: 201 });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

// PATCH update keyword
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    const updatedKeyword = await prisma.sEOKeyword.update({
      where: { id },
      data: updateData,
    });

    // Log the action
    await prisma.sEOAuditLog.create({
      data: {
        action: 'keyword_updated',
        entityType: 'keyword',
        entityId: id,
        changes: updateData,
        performedBy: 'admin',
        success: true,
      },
    });

    return NextResponse.json({ keyword: updatedKeyword });
  } catch (error) {
    console.error('Error updating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keyword' },
      { status: 500 }
    );
  }
}

// DELETE keyword
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    await prisma.sEOKeyword.delete({
      where: { id },
    });

    // Log the action
    await prisma.sEOAuditLog.create({
      data: {
        action: 'keyword_deleted',
        entityType: 'keyword',
        entityId: id,
        performedBy: 'admin',
        success: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
