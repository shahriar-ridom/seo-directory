import { MetadataRoute } from "next";
import { db } from "@/db";
import { locations, categories } from "@/db/schema";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("Generating Sitemap...");

  const [allLocations, allCategories] = await Promise.all([
    db.select({ slug: locations.slug }).from(locations),
    db.select({ slug: categories.slug }).from(categories),
  ]);

  // The Static Routes (Home, About, etc.)
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // The Programmatic Routes
  const programmaticRoutes: MetadataRoute.Sitemap = [];

  for (const location of allLocations) {
    for (const category of allCategories) {
      programmaticRoutes.push({
        url: `${BASE_URL}/directory/${location.slug}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  console.log(
    `Sitemap generated with ${routes.length + programmaticRoutes.length} URLs.`,
  );

  return [...routes, ...programmaticRoutes];
}
