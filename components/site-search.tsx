"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Tag, Loader2, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

type SearchResult = {
  locations: { name: string; slug: string; state: string | null }[];
  categories: { name: string; slug: string }[];
};

export function SiteSearch({ defaultCitySlug }: { defaultCitySlug: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<SearchResult>({
    locations: [],
    categories: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

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
        setResults({ locations: [], categories: [] });
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults({ locations: [], categories: [] });
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  // Navigation
  const handleSelect = (type: "location" | "category", slug: string) => {
    if (type === "location") {
      router.push(`/directory/${slug}/coffee-shops`);
    } else {
      router.push(`/directory/${defaultCitySlug}/${slug}`);
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
            if (results.locations.length > 0 || results.categories.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search for a city or category..."
          className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-3 md:py-4 text-base md:text-lg text-slate-900 placeholder:text-slate-400 outline-none font-medium h-full"
        />
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* No Results State */}
          {!isLoading &&
            results.locations.length === 0 &&
            results.categories.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm">
                  No results found for &quot;{query}&quot;
                </p>
              </div>
            )}

          {/* Locations Section */}
          {results.locations.length > 0 && (
            <div className="py-2">
              <div className="px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Cities
              </div>
              {results.locations.map((loc) => (
                <button
                  key={loc.slug}
                  onClick={() => handleSelect("location", loc.slug)}
                  className="group w-full text-left px-6 py-3.5 hover:bg-teal-50/50 flex items-center gap-4 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100/50 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors text-teal-600">
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

          {/* Categories Section */}
          {results.categories.length > 0 && (
            <div className="py-2 border-t border-slate-100 relative">
              <div className="px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Services
              </div>
              {results.categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleSelect("category", cat.slug)}
                  className="group w-full text-left px-6 py-3.5 hover:bg-amber-50/50 flex items-center gap-4 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-white transition-colors text-amber-500">
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
