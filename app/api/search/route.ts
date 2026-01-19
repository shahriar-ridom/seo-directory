import { NextResponse } from 'next/server';
import { db } from '@/db';
import { locations, categories } from '@/db/schema';
import { ilike } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ locations: [], categories: [] });
  }

  // Sanitize input slightly to prevent weird regex errors
  const safeQuery = `%${query}%`;

  const [matchedLocations, matchedCategories] = await Promise.all([
    db.select({ name: locations.name, slug: locations.slug, state: locations.state })
      .from(locations)
      .where(ilike(locations.name, safeQuery))
      .limit(5),

    db.select({ name: categories.name, slug: categories.slug })
      .from(categories)
      .where(ilike(categories.name, safeQuery))
      .limit(5),
  ]);

  return NextResponse.json({
    locations: matchedLocations,
    categories: matchedCategories,
  });
}
