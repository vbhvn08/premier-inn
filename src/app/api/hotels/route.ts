import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Hotel } from '@/app/types';

/**
 * GET handler for /api/hotels endpoint
 * Returns a list of hotels that can be filtered by search term
 */
export async function GET(request: Request) {
  try {
    // Get search parameter from URL, if any
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';

    // Read the hotels.json file
    const filePath = path.join(process.cwd(), 'public', 'hotels.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const hotelsData = JSON.parse(fileContent);

    // Filter hotels based on the query parameter
    let filteredHotels = hotelsData.hotels;
    if (query) {
      filteredHotels = filteredHotels.filter(
        (hotel: Hotel) =>
          hotel.title?.toLowerCase().includes(query) ||
          hotel.code?.toLowerCase().includes(query),
      );
    }

    // Limit the results to prevent overwhelming the UI
    const limitedResults = filteredHotels.slice(0, 20);

    // Return the filtered list
    return NextResponse.json({
      total: filteredHotels.length,
      hotels: limitedResults,
      query,
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels data' },
      { status: 500 },
    );
  }
}
