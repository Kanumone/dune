import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Follow redirects and get final URL
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    const finalUrl = response.url;

    // Try to extract coordinates from the final URL
    const coords = extractCoordinatesFromUrl(finalUrl);

    if (!coords) {
      return NextResponse.json(
        { error: 'Could not extract coordinates from the URL' },
        { status: 400 }
      );
    }

    return NextResponse.json(coords);
  } catch (error) {
    console.error('Error parsing map link:', error);
    return NextResponse.json(
      { error: 'Failed to parse map link' },
      { status: 500 }
    );
  }
}

function extractCoordinatesFromUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Yandex Maps format: https://yandex.by/maps/?ll=27.561500%2C53.904500&z=15
    const llMatch = url.match(/ll=([\d.]+)%2C([\d.]+)/);
    if (llMatch) {
      return { lng: parseFloat(llMatch[1]), lat: parseFloat(llMatch[2]) };
    }

    // Yandex Maps alternative format with comma: ?ll=27.561500,53.904500
    const llCommaMatch = url.match(/ll=([\d.]+),([\d.]+)/);
    if (llCommaMatch) {
      return { lng: parseFloat(llCommaMatch[1]), lat: parseFloat(llCommaMatch[2]) };
    }

    // Google Maps format: https://www.google.com/maps/@53.904500,27.561500,15z
    const googleMatch = url.match(/@([\d.]+),([\d.]+)/);
    if (googleMatch) {
      return { lat: parseFloat(googleMatch[1]), lng: parseFloat(googleMatch[2]) };
    }

    // Google Maps place format: /maps/place/.../@lat,lng
    const googlePlaceMatch = url.match(/\/maps\/place\/[^/]+\/@([\d.]+),([\d.]+)/);
    if (googlePlaceMatch) {
      return { lat: parseFloat(googlePlaceMatch[1]), lng: parseFloat(googlePlaceMatch[2]) };
    }

    // Coordinates in query params: ?lat=53.904500&lng=27.561500
    const queryLatLngMatch = url.match(/[?&]lat=([\d.]+).*[?&]lng=([\d.]+)/);
    if (queryLatLngMatch) {
      return { lat: parseFloat(queryLatLngMatch[1]), lng: parseFloat(queryLatLngMatch[2]) };
    }

    // Alternative format: ?latitude=53.904500&longitude=27.561500
    const queryLatitudeLongitudeMatch = url.match(/[?&]latitude=([\d.]+).*[?&]longitude=([\d.]+)/);
    if (queryLatitudeLongitudeMatch) {
      return { lat: parseFloat(queryLatitudeLongitudeMatch[1]), lng: parseFloat(queryLatitudeLongitudeMatch[2]) };
    }

    // Yandex Maps whatshere format: ?whatshere[point]=27.561500,53.904500
    const whatsHereMatch = url.match(/whatshere\[point\]=([\d.]+),([\d.]+)/);
    if (whatsHereMatch) {
      return { lng: parseFloat(whatsHereMatch[1]), lat: parseFloat(whatsHereMatch[2]) };
    }

    // 2GIS format: https://2gis.by/minsk/geo/27.561500%2C53.904500
    const dgisMatch = url.match(/\/geo\/([\d.]+)%2C([\d.]+)/);
    if (dgisMatch) {
      return { lng: parseFloat(dgisMatch[1]), lat: parseFloat(dgisMatch[2]) };
    }

    // 2GIS alternative format with comma
    const dgisCommaMatch = url.match(/\/geo\/([\d.]+),([\d.]+)/);
    if (dgisCommaMatch) {
      return { lng: parseFloat(dgisCommaMatch[1]), lat: parseFloat(dgisCommaMatch[2]) };
    }

    return null;
  } catch {
    return null;
  }
}
