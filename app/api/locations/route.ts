import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { locations } from '@/app/lib/schema';
import { Location } from '@/app/lib/types';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(locations).where(eq(locations.canShow, true)).orderBy(asc(locations.id));

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
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, lat, lng, description } = body;

    // Validate required fields
    if (!title || !lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required fields: title, lat, lng' },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: 'Coordinates must be numbers' },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates range' },
        { status: 400 }
      );
    }

    // Insert new location
    const result = await db.insert(locations).values({
      lat: lat.toString(),
      lng: lng.toString(),
      title,
      description: description || 'Там явно что-то интересное',
      badges: [],
      categories: [],
      popularity: 'small',
      clicks: 0,
      canShow: false,
    }).returning();

    const newLocation: Location = {
      id: result[0].id,
      coords: [parseFloat(result[0].lat), parseFloat(result[0].lng)],
      title: result[0].title,
      description: result[0].description,
      badges: result[0].badges,
      categories: result[0].categories as Location['categories'],
      popularity: result[0].popularity as Location['popularity'],
      clicks: result[0].clicks,
      canShow: result[0].canShow,
    };

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
