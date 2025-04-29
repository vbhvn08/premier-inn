import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for /api/countries endpoint
 * Returns a list of countries with their nationality and dialing codes
 */
export async function GET() {
  try {
    // Read the countries.json file
    const filePath = path.join(process.cwd(), 'public', 'countries.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const countriesData = JSON.parse(fileContent);

    // Return countries data
    return NextResponse.json(countriesData);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries data' },
      { status: 500 },
    );
  }
}
