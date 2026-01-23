import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { Location } from '@/app/lib/types';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        lat,
        lng,
        title,
        size,
        description,
        badges,
        categories,
        popularity,
        clicks
      FROM locations
      ORDER BY id
    `);

    const locations: Location[] = result.rows.map(row => ({
      id: row.id,
      coords: [row.lat, row.lng],
      title: row.title,
      size: row.size,
      description: row.description,
      badges: row.badges,
      categories: row.categories,
      popularity: row.popularity,
      clicks: row.clicks,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
