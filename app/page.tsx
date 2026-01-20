import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { getCachedData } from "@/lib/actions";

import dynamic from "next/dynamic";

const CategoryGrid = dynamic(
  () => import("@/components/category-grid").then((mod) => mod.CategoryGrid),
  {
    loading: () => (
      <div className="h-96 w-full animate-pulse bg-slate-200 rounded-xl" />
    ),
    ssr: true,
  },
);

const SiteSearch = dynamic(
  () => import("@/components/site-search").then((m) => m.SiteSearch),
  { ssr: true },
);

export default async function Home() {
  const { allCategories, topLocations, defaultCity, defaultCategorySlug } =
    await getCachedData();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-52 px-6 bg-[#0c3937] z-30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-100 md:w-150 h-100 md:h-150 rounded-full bg-teal-500/20 blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[0%] left-[-10%] w-75 md:w-125 h-75 md:h-125 rounded-full bg-emerald-900/40 blur-[60px] md:blur-[100px]" />
        </div>

        <div className="relative z-30 max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm text-amber-300 text-xs md:text-sm font-semibold tracking-wide">
            <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-300 text-amber-300" />
            <span>Over 1.2M+ Reviews</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
            Find the Best <br className="hidden md:block" />
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-400">
                Local Experts
              </span>
              <svg
                className="absolute -bottom-2 w-full h-2 md:h-3 text-amber-500/50 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
            <span className="block mt-2 text-2xl md:text-5xl text-teal-100/80 font-medium">
              Simplified.
            </span>
          </h1>

          <p className="text-base md:text-xl text-teal-100/70 max-w-2xl mx-auto leading-relaxed px-2">
            The premium directory for verified coffee shops, mechanics, and
            gyms.
            <br className="hidden md:block" />
            <span className="text-white font-medium border-b border-amber-400/50 mx-1">
              Zero friction
            </span>
            , total clarity.
          </p>

          <div className="mt-8 md:mt-12 max-w-2xl mx-auto relative z-50 px-2">
            <div className="relative p-1.5 md:p-2 rounded-full bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] flex items-center transition-all duration-300">
              <div className="flex-1 min-w-0">
                <SiteSearch defaultCitySlug={defaultCity.slug} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-teal-200/80">
              <span>Popular:</span>
              {["Coffee Shop", "Gym", "Lawyer"].map((tag) => (
                <Link
                  key={tag}
                  href={`/directory/${defaultCity.slug}/${tag.toLowerCase().replace(" ", "-")}`}
                  className="border-b border-white/20 hover:text-white hover:border-white cursor-pointer transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-6 bg-zinc-100 z-10">
        <CategoryGrid categories={allCategories} locations={topLocations} />
      </section>

      <section className="py-20 md:py-24 px-4 md:px-6 bg-white border-t border-slate-100 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Popular Cities
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {topLocations.slice(0, 12).map((loc) => (
              <Link
                key={loc.id}
                href={`/directory/${loc.slug}/${defaultCategorySlug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-semibold hover:bg-teal-600 hover:text-white transition-all"
              >
                <MapPin className="w-3 h-3 opacity-50" />
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
