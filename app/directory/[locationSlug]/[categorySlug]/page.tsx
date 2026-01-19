import { notFound } from "next/navigation";
import { db } from "@/db";
import { locations, categories, listings } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { Star, Globe, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <section className="relative pt-32 pb-32 px-6 bg-[#0c3937] z-30">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-150 h-150 rounded-full bg-teal-500/20 blur-[120px]" />
          <div className="absolute bottom-[0%] left-[-10%] w-150 h-150 rounded-full bg-emerald-900/40 blur-[100px]" />
        </div>

        <div className="relative z-30 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 shadow-sm backdrop-blur-md text-teal-100 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-amber-300">
              {location.name}, {location.state}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {heroText}
          </h1>

          <p className="text-lg text-teal-100/80 max-w-2xl mx-auto">
            We found{" "}
            <span className="text-white font-bold border-b border-amber-400/60">
              {items.length} verified
            </span>{" "}
            professionals ready to help you.
          </p>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[98%] z-20 pointer-events-none leading-none w-40 md:w-75">
          <svg
            viewBox="0 0 300 40"
            preserveAspectRatio="none"
            className="w-full h-4 md:h-8 fill-[#0c3937]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 C80,0 100,40 150,40 C200,40 220,0 300,0 Z" />
          </svg>
        </div>
      </section>

      <section className="relative py-24 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          {items.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between p-8 bg-white border border-slate-100 rounded-4xl shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-900/10 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-slate-50 to-white rounded-bl-full rounded-tr-4xl -z-10 opacity-50" />

                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl font-bold text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                        {item.name[0]}
                      </div>

                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-amber-700">
                          {item.rating}.0
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-medium text-teal-600/80 mb-3">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {item.description ||
                          `A top-rated ${category.name} provider located in ${location.name}. Dedicated to providing excellent service.`}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-2 border-t border-slate-50">
                    <a
                      href={item.websiteUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-bold text-teal-700 bg-teal-50 rounded-xl hover:bg-teal-600 hover:text-white transition-all duration-300 group/btn"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No listings found yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                We are currently verifying businesses in {location.name} for{" "}
                {category.name}. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> Go back home
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
