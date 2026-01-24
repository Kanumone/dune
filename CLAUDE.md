# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for mapping locations in Minsk, built with React 19, TypeScript, PostgreSQL (via Drizzle ORM), and the Yandex Maps API. The app displays interactive map markers (sized by click count) where users can view location details and add new places.

## Rules

Never start dev server, cause i will do it myself.

## Database Setup

The application uses PostgreSQL running in Docker with Drizzle ORM for database operations.

### Initial Setup

```bash
# Start PostgreSQL container
docker-compose up -d

# Apply schema to database (first time or after schema changes)
npm run db:push
```

### Migration Commands

**For local development (recommended):**
```bash
# Quick sync: applies schema.ts changes directly to DB without migration files
npm run db:push
```

**For production/team workflow:**
```bash
# 1. Generate migration SQL files from schema changes
npm run db:generate

# 2. Review generated SQL in drizzle/migrations/, then commit to git
git add drizzle/migrations/ && git commit -m "migration message"

# 3. Apply migrations on server (uses migration files)
npm run db:migrate
```

**Database GUI:**
```bash
# Open Drizzle Studio (visual database browser)
npm run db:studio
```

**Key difference:**
- `db:push` - Fast, no files, for local dev only. Changes schema directly.
- `db:migrate` - Uses versioned migration files. Safe for production. Trackable in git.

### Database Management

```bash
# View database logs
docker logs minskie-dunes-db

# Connect to database (password: minskie_dev_password)
docker exec -it minskie-dunes-db psql -U minskie -d minskie_dunes

# Stop database
docker-compose down

# Remove database volume (WARNING: deletes all data)
docker-compose down -v
```

### Database Schema Management

The project uses **Drizzle ORM** for type-safe database operations. Schema is defined in `app/lib/schema.ts` and synced with `app/lib/types.ts`.

**Key fields in locations table:**
- `id` (serial): Primary key
- `lat`, `lng` (decimal): Coordinates stored as `[lat, lng]` format
- `title` (varchar): Location name
- `description` (text): Location details
- `badges` (text[]): Array of badge labels
- `categories` (text[]): Array of category types ('music' | 'weird' | 'party' | 'cozy')
- `popularity` (varchar): Size classification ('small' | 'medium' | 'large')
- `clicks` (integer): Click counter for marker sizing
- `canShow` (boolean): Visibility flag (default: false for new locations)
- `createdAt` (timestamp): Creation timestamp

**Database client usage:**
- Import `db` from `app/lib/db.ts` for Drizzle queries
- Import table definitions from `app/lib/schema.ts`
- Use Drizzle query API (not raw SQL) for all database operations

## Environment Configuration

I use .env file for saving environment variables. If you add new secrets do'nt forget add it to .env.example

## Architecture

### Client-Side State Management

The app uses React hooks for state management in `app/page.tsx`:
- `locations`: Array of all locations fetched from API
- `activeFilter`: Current category filter (unused in UI currently)
- `selectedLocation`: Location shown in PlaceCard
- `isLegendOpen` / `isContactOpen`: Control panel visibility (mutually exclusive)

### Data Flow

1. `app/page.tsx` fetches locations from `/api/locations` on mount
2. Locations passed to `YandexMap` component which renders markers
3. Clicking a marker calls `onSelectLocation` → updates `selectedLocation` → opens PlaceCard
4. Adding location via LegendPanel → POST to `/api/locations` → calls `fetchLocations()` to refresh

### Yandex Maps Integration

The `YandexMap` component (`app/components/YandexMap.tsx`) uses a complex initialization pattern:

1. Dynamically loads Yandex Maps script via `loadYandexMapsScript()`
2. Uses `@yandex/ymaps3-reactify` to create React components from Yandex Maps API
3. Initializes once in useEffect, stores reactified API in state
4. Uses `reactify.useDefault()` for values that need to update (map location, marker coordinates)

**Critical**: Marker coordinates are stored as `[lat, lng]` in the database and Location type, but Yandex Maps expects `[lng, lat]` format. The coordinate swap happens in YandexMap component.

Marker size is dynamic based on clicks count: 32px at 0 clicks, scaling to 56px at 1000+ clicks (see `getMarkerSize()`).

### API Routes

All API routes use Drizzle ORM via the `db` instance from `app/lib/db.ts`:

- `GET /api/locations` - Returns all locations (uses `db.select()`)
- `POST /api/locations` - Creates new location with `canShow: false` (uses `db.insert()`)
  - Required fields: `title`, `lat`, `lng`
  - Optional: `description` (defaults to "Там явно что-то интересное")
  - Auto-populated: `badges: []`, `categories: []`, `popularity: 'small'`, `clicks: 0`
- `PUT /api/locations/[id]/clicks` - Increments click count (uses `db.update()` with `sql` increment)
- `POST /api/parse-map-link` - Parses Yandex Maps share links to extract coordinates (no DB interaction)

### Type System

Core types defined in `app/lib/types.ts` (must stay in sync with `app/lib/schema.ts`):
- `Location`: Main data model
  - `coords: [number, number]` - Always `[lat, lng]` format (NOT the same as Yandex Maps format)
  - `canShow: boolean` - Visibility flag for moderation
- `LocationCategory`: 'music' | 'weird' | 'party' | 'cozy'
- `Popularity`: 'small' | 'medium' | 'large'

**Important**: Drizzle returns decimals as strings, so coordinates must be parsed with `parseFloat()` when mapping from DB rows to Location objects.

### Component Structure

- `app/page.tsx` - Main page, orchestrates all components
- `app/components/YandexMap.tsx` - Map display with markers
- `app/components/PlaceCard.tsx` - Location detail modal
- `app/components/LegendPanel.tsx` - Slide-in panel with AddLocationForm
- `app/components/ContactPanel.tsx` - FAQ/contact slide-in panel
- `app/components/AddLocationForm.tsx` - Form to add locations (parses Yandex Maps links)
- `app/components/Header.tsx` - Top navigation bar

Panels (LegendPanel, ContactPanel) are mutually exclusive - opening one closes the other.

## Key Implementation Details

### Adding New Locations

The AddLocationForm supports two input methods:
1. Pasting a Yandex Maps share link (parsed via `/api/parse-map-link`)
2. Manual coordinate entry

Both create a POST request to `/api/locations` which returns the created location.

### Coordinate Handling

**Always remember**: Database stores `[lat, lng]` but Yandex Maps uses `[lng, lat]`. Convert when passing to map components.

### Yandex Maps API Key

The API key is hardcoded in `YandexMap.tsx`. This is acceptable for Yandex Maps as they use domain restrictions, not secret keys.
