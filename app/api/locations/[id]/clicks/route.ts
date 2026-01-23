import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

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
    const result = await pool.query(
      `
      UPDATE locations
      SET clicks = clicks + 1
      WHERE id = $1
      RETURNING clicks
      `,
      [locationId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ clicks: result.rows[0].clicks });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to increment clicks' },
      { status: 500 }
    );
  }
}
