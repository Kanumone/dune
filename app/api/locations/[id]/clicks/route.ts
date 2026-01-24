import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { locations } from '@/app/lib/schema';
import { eq, sql } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locationId = parseInt(id);

    if (isNaN(locationId)) {
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      );
    }

    // Increment clicks count
    const result = await db
      .update(locations)
      .set({ clicks: sql`${locations.clicks} + 1` })
      .where(eq(locations.id, locationId))
      .returning({ clicks: locations.clicks });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ clicks: result[0].clicks });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to increment clicks' },
      { status: 500 }
    );
  }
}
