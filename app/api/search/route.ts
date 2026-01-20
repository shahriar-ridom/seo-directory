import { NextResponse } from "next/server";
import { db } from "@/db";
import { listings, locations, categories } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ listings: [], locations: [], categories: [] });
  }

  const searchTerm = `%${query.trim()}%`;

  try {
    const [listingsRes, locationsRes, categoriesRes] = await Promise.all([
      // Listings Search
      db
        .select({
          name: listings.name,
          slug: listings.slug,
          description: listings.description,
        })
        .from(listings)
        .where(
          or(
            ilike(listings.name, searchTerm),
            ilike(listings.description, searchTerm),
            ilike(listings.categorySlug, searchTerm),
          ),
        )
        .limit(5),

      // Locations Search
      db
        .select({
          name: locations.name,
          slug: locations.slug,
          state: locations.state,
        })
        .from(locations)
        .where(ilike(locations.name, searchTerm))
        .limit(3),

      // Categories Search
      db
        .select({
          name: categories.name,
          slug: categories.slug,
        })
        .from(categories)
        .where(ilike(categories.name, searchTerm))
        .limit(3),
    ]);

    return NextResponse.json({
      listings: listingsRes,
      locations: locationsRes,
      categories: categoriesRes,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
