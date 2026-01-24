import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { locations } from '@/app/lib/schema';
import { verifyAuth } from '@/app/lib/auth';
import { asc } from 'drizzle-orm';
import { Location } from '@/app/lib/types';

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await db
      .select()
      .from(locations)
      .orderBy(asc(locations.id));

    const locationsData: Location[] = result.map(row => ({
      id: row.id,
      coords: [parseFloat(row.lat), parseFloat(row.lng)],
      title: row.title,
      description: row.description,
      badges: row.badges,
      categories: row.categories as Location['categories'],
      popularity: row.popularity as Location['popularity'],
      clicks: row.clicks,
      canShow: row.canShow,
    }));

    return NextResponse.json(locationsData);
  } catch (error) {
    console.error('Admin locations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
