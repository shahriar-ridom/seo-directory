import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { faker } from "@faker-js/faker";
import * as schema from "@/db/schema";
import { locations, categories, listings } from "@/db/schema";

// Load environment variables from .env
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const SEED_CONFIG = {
  LOCATIONS: 20,
  CATEGORIES: 10,
  LISTINGS: 1000,
};

async function seed() {
  console.log("🌱 Starting Seed Process...");
  console.log(
    `Target: ${SEED_CONFIG.LOCATIONS} Locations, ${SEED_CONFIG.CATEGORIES} Categories, ${SEED_CONFIG.LISTINGS} Listings.`,
  );

  try {
    // 1. CLEANUP
    console.log("Cleaning existing data...");
    await db.delete(listings);
    await db.delete(categories);
    await db.delete(locations);
    console.log("Tables cleaned.");

    // 2. SEED LOCATIONS
    console.log("Generating Locations...");
    const locationData: (typeof locations.$inferInsert)[] = [];

    for (let i = 0; i < SEED_CONFIG.LOCATIONS; i++) {
      const city = faker.location.city();
      const state = faker.location.state();
      const slug = `${city.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${state.toLowerCase().slice(0, 2)}-${faker.string.alpha(3)}`;

      locationData.push({
        name: city,
        state: state,
        slug: slug,
        metaTitle: `Best Services in ${city}, ${state}`,
        metaDescription: `Find top-rated businesses in ${city}, ${state}.`,
      });
    }

    const insertedLocations = await db
      .insert(locations)
      .values(locationData)
      .returning({ id: locations.id });
    console.log(`Seeded ${insertedLocations.length} locations.`);

    // 3. SEED CATEGORIES
    console.log("Generating Categories...");
    const categoryNames = [
      "Coffee Shops",
      "Gyms",
      "Coworking Spaces",
      "Yoga Studios",
      "Mechanics",
      "Plumbers",
      "Dentists",
      "Barbershops",
      "Pet Groomers",
      "Vegan Restaurants",
    ];

    const categoryData = categoryNames.map((name) => ({
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      templateData: { heroText: `Find the best ${name} in town` },
    }));

    const insertedCategories = await db
      .insert(categories)
      .values(categoryData)
      .returning({ id: categories.id });
    console.log(`✅ Seeded ${insertedCategories.length} categories.`);

    // 4. SEED LISTINGS
    console.log("Generating Listings...");
    const listingData: (typeof listings.$inferInsert)[] = [];

    for (let i = 0; i < SEED_CONFIG.LISTINGS; i++) {
      const randomLocation = faker.helpers.arrayElement(insertedLocations);
      const randomCategory = faker.helpers.arrayElement(insertedCategories);
      const name = faker.company.name();

      listingData.push({
        name: name,
        slug: `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${faker.string.alpha(4)}`,
        description: faker.lorem.paragraph(),
        websiteUrl: faker.internet.url(),
        rating: faker.number.int({ min: 1, max: 5 }),
        locationId: randomLocation.id,
        categoryId: randomCategory.id,
      });
    }

    const batchSize = 100;
    for (let i = 0; i < listingData.length; i += batchSize) {
      const batch = listingData.slice(i, i + batchSize);
      await db.insert(listings).values(batch);
      process.stdout.write(".");
    }

    console.log(`Seeded ${listingData.length} listings.`);

    console.log("Seeding Complete! Go build something awesome.");
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
}

seed();
