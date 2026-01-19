import { notFound } from "next/navigation";
import { db } from "@/db";
import { locations, categories, listings } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationSlug: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locationSlug, categorySlug } = await params;

  const location = await db.query.locations.findFirst({
    where: eq(locations.slug, locationSlug),
  });
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (!location || !category) return {};

  return {
    title: `Best ${category.name} in ${location.name} | Top Rated 2026`,
    description: `Find the highest-rated ${category.name.toLowerCase()} in ${location.name}, ${location.state}. Read reviews and compare prices.`,
  };
}

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ locationSlug: string; categorySlug: string }>;
}) {
  const { locationSlug, categorySlug } = await params;

  const [location, category] = await Promise.all([
    db.query.locations.findFirst({ where: eq(locations.slug, locationSlug) }),
    db.query.categories.findFirst({ where: eq(categories.slug, categorySlug) }),
  ]);

  if (!location || !category) {
    notFound();
  }

  const items = await db
    .select()
    .from(listings)
    .where(
      and(
        eq(listings.locationId, location.id),
        eq(listings.categoryId, category.id),
      ),
    )
    .orderBy(desc(listings.rating));

  let heroText = `Best ${category.name} in ${location.name}`;
  try {
    if (typeof category.templateData === "string") {
      const parsed = JSON.parse(category.templateData);
      if (parsed.heroText) heroText = parsed.heroText;
    } else if (
      category.templateData &&
      typeof category.templateData === "object"
    ) {
      // @ts-ignore
      if (category.templateData.heroText)
        // @ts-ignore
        heroText = category.templateData.heroText;
    }
  } catch (e) {
    console.error("JSON Parse error", e);
  }

  heroText = heroText.replace("{city}", location.name);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <header className="mb-12 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            {location.name}, {location.state}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-4">
            {heroText}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            We found{" "}
            <span className="font-bold text-blue-600">{items.length}</span>{" "}
            verified businesses matching your criteria.
          </p>
        </header>

        {/* GRID SECTION */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">
                    {item.name[0]}
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-bold text-green-700 dark:text-green-400">
                    ★ {item.rating}.0
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                  {item.description}
                </p>
              </div>

              <a
                href={item.websiteUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
              >
                Visit Website
              </a>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-semibold">No listings found yet.</h3>
            <p className="text-gray-500">
              Be the first to list your business here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
