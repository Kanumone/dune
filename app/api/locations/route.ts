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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, size, lat, lng, description } = body;

    // Validate required fields
    if (!title || !size || !lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required fields: title, size, lat, lng' },
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
    const result = await pool.query(
      `
      INSERT INTO locations (lat, lng, title, size, description, badges, categories, popularity, clicks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, lat, lng, title, size, description, badges, categories, popularity, clicks
      `,
      [
        lat,
        lng,
        title,
        size,
        description || 'Описание скоро появится',
        [], // badges
        [], // categories
        'small', // default popularity
        0, // initial clicks
      ]
    );

    const newLocation: Location = {
      id: result.rows[0].id,
      coords: [result.rows[0].lat, result.rows[0].lng],
      title: result.rows[0].title,
      size: result.rows[0].size,
      description: result.rows[0].description,
      badges: result.rows[0].badges,
      categories: result.rows[0].categories,
      popularity: result.rows[0].popularity,
      clicks: result.rows[0].clicks,
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
