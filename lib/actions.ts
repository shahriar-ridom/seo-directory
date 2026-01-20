import { db } from "@/db";
import { categories, locations } from "@/db/schema";

export async function getCachedData() {
  "use cache";
  const [allCategories, topLocations] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories),
    db
      .select({
        id: locations.id,
        name: locations.name,
        slug: locations.slug,
        state: locations.state,
      })
      .from(locations)
      .limit(12),
  ]);

  const defaultCity = topLocations[0] || {
    name: "Austin",
    slug: "austin",
    state: "TX",
  };
  const defaultCategorySlug = allCategories[0]?.slug || "coffee-shop";

  return {
    allCategories,
    topLocations,
    defaultCity,
    defaultCategorySlug,
  };
}
