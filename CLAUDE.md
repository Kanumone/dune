# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for mapping locations in Minsk, built with React 19, TypeScript, PostgreSQL, and the Yandex Maps API. The app displays interactive map markers (sized by click count) where users can view location details and add new places.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Setup

The application uses PostgreSQL running in Docker:

```bash
# Start PostgreSQL container
docker-compose up -d

# View database logs
docker logs minskie-dunes-db

# Connect to database (password: minskie_dev_password)
docker exec -it minskie-dunes-db psql -U minskie -d minskie_dunes

# Stop database
docker-compose down
```

Database schema is automatically initialized from `schema.sql` on first run. The main table is `locations` with columns: id, lat, lng, title, description, badges (text[]), categories (text[]), popularity, clicks.

## Environment Configuration

Copy `.env.example` to `.env` for local development. The DATABASE_URL must point to the PostgreSQL instance (default: `postgresql://minskie:minskie_dev_password@localhost:5432/minskie_dunes`).

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

- `GET /api/locations` - Returns all locations
- `POST /api/locations` - Creates new location (requires: title, lat, lng; optional: description)
- `POST /api/locations/[id]/clicks` - Increments click count
- `POST /api/parse-map-link` - Parses Yandex Maps share links to extract coordinates

All API routes use the pg Pool from `app/lib/db.ts` which connects via DATABASE_URL.

### Type System

Core types defined in `app/lib/types.ts`:
- `Location`: Main data model (coords as `[lat, lng]` tuple)
- `LocationCategory`: 'music' | 'weird' | 'party' | 'cozy'
- `Popularity`: 'small' | 'medium' | 'large'

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
