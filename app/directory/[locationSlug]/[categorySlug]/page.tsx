import { notFound } from "next/navigation";
import { db } from "@/db";
import { listings, locations, categories } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { CopyrightYear } from "@/components/copyrightYear";

// DATA LAYER
async function getPageData(locSlug: string, catSlug: string) {
  "use cache";
  cacheTag(`directory-${locSlug}-${catSlug}`);

  const [location, category] = await Promise.all([
    db.query.locations.findFirst({ where: eq(locations.slug, locSlug) }),
    db.query.categories.findFirst({ where: eq(categories.slug, catSlug) }),
  ]);

  if (!location || !category) return null;

  const items = await db
    .select()
    .from(listings)
    .where(
      and(
        eq(listings.locationSlug, locSlug),
        eq(listings.categorySlug, catSlug),
      ),
    )
    .orderBy(desc(listings.rating))
    .limit(50);

  return { location, category, items };
}

// Hero Section
async function DirectoryHero({
  params,
}: {
  params: Promise<{ locationSlug: string; categorySlug: string }>;
}) {
  const { locationSlug, categorySlug } = await params;

  const data = await getPageData(locationSlug, categorySlug);
  if (!data) return null;

  const { location, category, items } = data;

  let heroText = `Best ${category.name} in ${location.name}`;
  try {
    const tData = category.templateData as any;
    if (tData?.heroText) heroText = tData.heroText;
  } catch (e) {
    /* ignore */
  }
  heroText = heroText.replace("{city}", location.name);

  return (
    <section className="relative pt-32 pb-32 px-6 bg-[#0c3937] z-30 overflow-hidden">
      <div className="absolute top-[-50%] right-[-10%] w-125 h-125 rounded-full bg-teal-500/20 blur-[120px] pointer-events-none" />

      <div className="relative z-30 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-teal-100 text-sm">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-amber-300 capitalize">{category.name}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          {heroText}
        </h1>

        <p className="text-lg text-teal-100/80 max-w-2xl mx-auto">
          Showing{" "}
          <span className="text-white font-bold">{items.length} verified</span>{" "}
          professionals near you.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full leading-none z-20">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-16 md:h-24 fill-slate-50 opacity-100 block"
        >
          <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}

// Listings Grid
async function DirectoryListings({
  params,
}: {
  params: Promise<{ locationSlug: string; categorySlug: string }>;
}) {
  const { locationSlug, categorySlug } = await params;

  const data = await getPageData(locationSlug, categorySlug);
  if (!data) return notFound();

  const { items } = data;

  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        {items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-xl font-bold text-teal-700">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-amber-800">
                        {item.rating || 5}.0
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>
                <a
                  href={`/listing/${item.slug}`}
                  className="mt-auto flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-slate-900">
              No listings yet
            </h3>
            <p className="text-slate-500">Be the first to list here!</p>
          </div>
        )}
      </div>
    </section>
  );
}

// MAIN PAGE
export default function Page({
  params,
}: {
  params: Promise<{ locationSlug: string; categorySlug: string }>;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Suspense fallback={<HeroSkeleton />}>
        {/* Pass params as a promise */}
        <DirectoryHero params={params} />
      </Suspense>

      <Suspense fallback={<ListSkeleton />}>
        {/* Pass params as a promise */}
        <DirectoryListings params={params} />
      </Suspense>
    </main>
  );
}

// SKELETONS
function HeroSkeleton() {
  return (
    <div className="h-125 bg-[#0c3937] w-full animate-pulse flex items-center justify-center">
      <div className="h-12 w-2/3 bg-white/10 rounded-lg"></div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 bg-slate-200 rounded-2xl animate-pulse"
        ></div>
      ))}
    </div>
  );
}

// --- METADATA ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationSlug: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locationSlug, categorySlug } = await params;
  const data = await getPageData(locationSlug, categorySlug);
  if (!data) return {};
  return {
    title: `Best ${data.category.name} in ${data.location.name} | Top Rated in ${new Date().getFullYear()}`,
    description: `Find the highest-rated ${data.category.name} in ${data.location.name}.`,
  };
}
