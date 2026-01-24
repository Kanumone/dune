import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { locations } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/app/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const locationId = parseInt(id);

    if (isNaN(locationId)) {
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { canShow } = body;

    if (typeof canShow !== 'boolean') {
      return NextResponse.json(
        { error: 'canShow must be a boolean' },
        { status: 400 }
      );
    }

    const result = await db
      .update(locations)
      .set({ canShow })
      .where(eq(locations.id, locationId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: result[0],
    });
  } catch (error) {
    console.error('Update location error:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const locationId = parseInt(id);

    if (isNaN(locationId)) {
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      );
    }

    const result = await db
      .delete(locations)
      .where(eq(locations.id, locationId))
      .returning({ id: locations.id });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: result[0].id,
    });
  } catch (error) {
    console.error('Delete location error:', error);
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    );
  }
}
