"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Tag,
  Loader2,
  ChevronRight,
  Store,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

type SearchResult = {
  listings: { name: string; slug: string; description: string }[];
  locations: { name: string; slug: string; state: string | null }[];
  categories: { name: string; slug: string }[];
};

export function SiteSearch({ defaultCitySlug }: { defaultCitySlug: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCity, setActiveCity] = useState(defaultCitySlug);

  const [results, setResults] = useState<SearchResult>({
    listings: [],
    locations: [],
    categories: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncCity = () => {
      const savedCity = localStorage.getItem("user_preferred_city");
      if (savedCity) {
        setActiveCity(savedCity);
      }
    };

    syncCity();

    window.addEventListener("city-preference-changed", syncCity);

    window.addEventListener("storage", syncCity);

    return () => {
      window.removeEventListener("city-preference-changed", syncCity);
      window.removeEventListener("storage", syncCity);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length < 2) {
        setResults({ listings: [], locations: [], categories: [] });
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults({
          listings: data.listings || [],
          locations: data.locations || [],
          categories: data.categories || [],
        });
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (
    type: "location" | "category" | "listing",
    slug: string,
  ) => {
    if (type === "location") {
      localStorage.setItem("user_preferred_city", slug);
      setActiveCity(slug);
      router.push(`/directory/${slug}/coffee-shop`);
    } else if (type === "category") {
      router.push(`/directory/${activeCity}/${slug}`);
    } else if (type === "listing") {
      console.log("Click Intiated");
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length === 0) setIsOpen(false);
          }}
          onFocus={() => {
            if (
              results.locations.length ||
              results.categories.length ||
              results.listings.length
            ) {
              setIsOpen(true);
            }
          }}
          placeholder={`Search in ${activeCity.replace(/-/g, " ")}...`}
          className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-3 md:py-4 text-base md:text-lg text-slate-900 placeholder:text-slate-400 outline-none font-medium h-full"
        />
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 max-h-[80vh] overflow-y-auto">
          {/* Empty State */}
          {!isLoading &&
            !results.locations.length &&
            !results.categories.length &&
            !results.listings.length && (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm">
                  No results found for &quot;{query}&quot;
                </p>
              </div>
            )}

          {/* LISTINGS */}
          {results.listings.length > 0 && (
            <div className="py-2">
              <div className="px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Businesses
              </div>
              {results.listings.map((item, idx) => (
                <button
                  key={`${item.slug}-${idx}`}
                  onClick={() => handleSelect("listing", item.slug)}
                  className="group w-full text-left px-6 py-3.5 hover:bg-slate-50 flex items-start gap-4 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mt-1 shrink-0 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <Store className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-slate-900 font-semibold truncate group-hover:text-teal-700">
                      {item.name}
                    </span>
                    <span className="block text-xs text-slate-500 truncate mt-0.5">
                      {item.description
                        ? item.description.substring(0, 60) + "..."
                        : "Local business"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* LOCATIONS */}
          {results.locations.length > 0 && (
            <div
              className={`py-2 ${results.listings.length > 0 ? "border-t border-slate-100" : ""}`}
            >
              <div className="px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Change City
              </div>
              {results.locations.map((loc) => (
                <button
                  key={loc.slug}
                  onClick={() => handleSelect("location", loc.slug)}
                  className="group w-full text-left px-6 py-3.5 hover:bg-teal-50/50 flex items-center gap-4 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100/50 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors text-teal-600 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-slate-700 font-semibold group-hover:text-teal-900">
                      {loc.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium group-hover:text-teal-600/70">
                      {loc.state}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* CATEGORIES */}
          {results.categories.length > 0 && (
            <div className={`py-2 border-t border-slate-100`}>
              <div className="px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Services in{" "}
                <span className="text-teal-600 capitalize">
                  {activeCity.replace(/-/g, " ")}
                </span>
              </div>
              {results.categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleSelect("category", cat.slug)}
                  className="group w-full text-left px-6 py-3.5 hover:bg-amber-50/50 flex items-center gap-4 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-white transition-colors text-amber-500 shrink-0">
                    <Tag className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-slate-700 font-semibold group-hover:text-amber-900">
                    {cat.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
