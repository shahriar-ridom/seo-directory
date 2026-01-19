import Link from "next/link";
import { db } from "@/db";
import { locations, categories } from "@/db/schema";
import { SiteSearch } from "@/components/site-search";

export default async function Home() {
  //Asynchronously Fetch Data
  const [allCategories, allLocations] = await Promise.all([
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
      .from(locations),
  ]);

  const topLocations = allLocations.slice(0, 12);
  //Need to add GEO Location to find user's location and default it to that City
  const defaultCity = topLocations[0];

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* HERO SECTION */}
      <section className="relative py-20 px-6 text-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
            Find Local Professionals
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400">
            The most comprehensive directory for{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Coffee Shops, Gyms, Mechanics
            </span>{" "}
            and more.
          </p>

          {/* Search Component */}
          <div className="mt-8">
            <SiteSearch
              locations={allLocations}
              categories={allCategories}
              defaultCitySlug={defaultCity.slug}
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center md:text-left">
          Categories in Your City
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/directory/${defaultCity.slug}/${cat.slug}`}
              className="group flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all bg-zinc-50 dark:bg-zinc-900"
            >
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-3 text-xl group-hover:scale-110 transition-transform">
                {cat.name[0]}
              </div>
              <span className="font-medium text-sm text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* LOCATIONS LIST */}
      <section className="py-16 px-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-8">
            {topLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/directory/${loc.slug}/coffee-shops`}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-blue-500"></span>
                {loc.name}, {loc.state}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
