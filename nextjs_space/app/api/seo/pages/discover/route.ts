
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { discoverPages, autoPopulatePages } from '@/lib/page-discovery'

// Discover all pages
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await discoverPages()
    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error discovering pages:', error)
    return NextResponse.json({ error: 'Failed to discover pages' }, { status: 500 })
  }
}

// Auto-populate pages with SEO config
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await autoPopulatePages()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error auto-populating pages:', error)
    return NextResponse.json({ error: 'Failed to auto-populate pages' }, { status: 500 })
  }
}

