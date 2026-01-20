import "dotenv/config";
import { db } from "@/db";
import { locations, categories, listings } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting 1M Row Seed...");

  // 1. Clean Slate
  console.log("🧹 Clearing DB...");
  await db.execute(
    sql`TRUNCATE TABLE ${listings}, ${locations}, ${categories} RESTART IDENTITY CASCADE`,
  );

  // 2. Setup Reference Data
  // We need more than 10 cities for 1M rows, or your pages will be massive.
  // Let's generate 50 realistic cities.
  console.log("📍 Generating Locations & Categories...");

  const createdLocations: { id: number; slug: string }[] = [];
  const createdCategories: { id: number; slug: string }[] = [];

  // --- Locations ---
  const locationsData = [];
  // Hardcoded + Random mix
  const BASE_CITIES = [
    "Austin",
    "New York",
    "San Francisco",
    "Chicago",
    "Miami",
  ];

  for (let i = 0; i < 50; i++) {
    const city =
      i < BASE_CITIES.length ? BASE_CITIES[i] : faker.location.city();
    // Ensure unique slug if faker duplicates a city name
    const slug = faker.helpers
      .slugify(`${city}-${faker.string.alpha(3)}`)
      .toLowerCase();

    locationsData.push({
      name: city,
      slug: slug,
      state: "US",
      metaTitle: `Best Services in ${city}`,
      metaDescription: `Find top rated services in ${city}`,
    });
  }

  // Bulk insert locations and return IDs + Slugs (Crucial for denormalization)
  const locs = await db.insert(locations).values(locationsData).returning({
    id: locations.id,
    slug: locations.slug,
  });
  createdLocations.push(...locs);

  // --- Categories ---
  const SERVICES = [
    "Coffee Shop",
    "Gym",
    "Plumber",
    "Dentist",
    "Lawyer",
    "Bakery",
    "Mechanic",
    "Florist",
    "Barber",
    "Yoga Studio",
    "Electrician",
    "HVAC",
    "Landscaper",
    "Painter",
    "Roofer",
  ];

  const categoriesData = SERVICES.map((service) => ({
    name: service,
    slug: faker.helpers.slugify(service).toLowerCase(),
    templateData: {},
  }));

  const cats = await db.insert(categories).values(categoriesData).returning({
    id: categories.id,
    slug: categories.slug,
  });
  createdCategories.push(...cats);

  // 3. The Big One: 1,000,000 Listings
  const TOTAL_LISTINGS = 1_000_000;
  const BATCH_SIZE = 2000;
  type NewListing = typeof listings.$inferInsert;
  const listingsBatch: NewListing[] = [];

  console.log(`🚀 Generating ${TOTAL_LISTINGS.toLocaleString()} Listings...`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_LISTINGS; i++) {
    const name = faker.company.name();

    // Pick random Location & Category ONCE
    const loc = faker.helpers.arrayElement(createdLocations);
    const cat = faker.helpers.arrayElement(createdCategories);

    listingsBatch.push({
      name: name,
      slug: faker.helpers.slugify(`${name}-${i}`).toLowerCase(), // Ensure unique slug
      description: faker.lorem.paragraph(),

      // Foreign Keys (Standard Normalization)
      locationId: loc.id,
      categoryId: cat.id,

      // Denormalized Columns (The Fix for Speed)
      locationSlug: loc.slug,
      categorySlug: cat.slug,

      websiteUrl: faker.internet.url(),
      rating: faker.number.int({ min: 1, max: 5 }),
    });

    // Flush batch
    if (listingsBatch.length >= BATCH_SIZE) {
      await db.insert(listings).values(listingsBatch);
      listingsBatch.length = 0; // Clear array

      // Progress Bar
      if (i % 50000 === 0) {
        const percent = ((i / TOTAL_LISTINGS) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        process.stdout.write(
          `\r✅ ${percent}% (${i.toLocaleString()} rows) - ${elapsed}s elapsed...`,
        );
      }
    }
  }

  // Insert any leftovers
  if (listingsBatch.length > 0) {
    await db.insert(listings).values(listingsBatch);
  }

  console.log(
    `\n\n🎉 DONE! 1M rows inserted in ${((Date.now() - startTime) / 1000).toFixed(2)}s`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seed Failed:", err);
  process.exit(1);
});
