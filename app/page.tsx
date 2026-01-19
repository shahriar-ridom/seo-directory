import Link from "next/link";
import { db } from "@/db";
import { locations, categories } from "@/db/schema";
import { SiteSearch } from "@/components/site-search";
import { MapPin, ArrowRight, Star } from "lucide-react";

export default async function Home() {
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

  const defaultCity = topLocations[0];

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
                <SiteSearch defaultCitySlug={defaultCity?.slug || "austin"} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-teal-200/80">
              <span>Popular:</span>
              {["Coffee", "Gyms", "Lawyers"].map((tag) => (
                <span
                  key={tag}
                  className="border-b border-white/20 hover:text-white hover:border-white cursor-pointer transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[98%] z-20 pointer-events-none leading-none w-40 md:w-75">
          <svg
            viewBox="0 0 300 40"
            preserveAspectRatio="none"
            className="w-full h-5 md:h-12 fill-[#0c3937]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 C80,0 100,40 150,40 C200,40 220,0 300,0 Z" />
          </svg>
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-6 bg-zinc-100 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Explore Top Categories
            </h2>
            <div className="w-16 md:w-20 h-1.5 bg-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-slate-700 text-base md:text-lg max-w-2xl mx-auto">
              We’ve curated the best professionals in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/directory/${defaultCity?.slug || "city"}/${cat.slug}`}
                className="group relative bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-900/10 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-start"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-slate-50 to-white rounded-bl-full -z-10 opacity-50" />
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center mb-6 transition-colors duration-300">
                  <span className="text-xl md:text-2xl text-teal-700 group-hover:text-white font-bold transition-colors">
                    {cat.name[0]}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg md:text-xl mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-600 font-medium mb-6">
                  View 120+ Listings
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-teal-800 group-hover:text-amber-500 transition-colors">
                  Explore{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:border-teal-600 hover:text-teal-700 transition-all text-sm md:text-base"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-4 md:px-6 bg-white border-t border-slate-100 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10">
            <span className="text-teal-800 font-bold uppercase tracking-wider text-[10px] md:text-xs bg-teal-100 px-3 py-1 rounded-full">
              Nationwide
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-4">
              Top Cities
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {topLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/directory/${loc.slug}/coffee-shops`}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-sm bg-slate-50 text-slate-600 text-sm md:text-base font-semibold hover:bg-teal-600 hover:text-white transition-all duration-200"
              >
                <MapPin className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                {loc.name}, {loc.state}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
