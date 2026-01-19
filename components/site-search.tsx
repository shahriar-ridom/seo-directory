"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Tag, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

type SearchResult = {
  locations: { name: string; slug: string; state: string | null }[];
  categories: { name: string; slug: string }[];
};

export function SiteSearch({ defaultCitySlug }: { defaultCitySlug: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<SearchResult>({ locations: [], categories: [] });

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
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
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
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if(e.target.value.length === 0) setIsOpen(false);
          }}
          onFocus={() => {
            if (results.locations.length > 0 || results.categories.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search for a city or category..."
          className="w-full pl-12 pr-4 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all"
        />

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Search className="h-5 w-5" />
            )}
        </div>
      </div>

      {/* DROPDOWN RESULTS */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50">

          {/* No Results State */}
          {!isLoading && results.locations.length === 0 && results.categories.length === 0 && (
              <div className="p-4 text-center text-zinc-500">
                No results found.
              </div>
            )}

          {/* Locations Section */}
          {results.locations.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Locations
              </div>
              {results.locations.map((loc) => (
                <button
                  key={loc.slug}
                  onClick={() => handleSelect("location", loc.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-zinc-700 dark:text-zinc-200">
                    {loc.name}, <span className="text-zinc-500">{loc.state}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Categories Section */}
          {results.categories.length > 0 && (
            <div className="py-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="px-4 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Categories
              </div>
              {results.categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleSelect("category", cat.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                >
                  <Tag className="h-4 w-4 text-green-500" />
                  <span className="text-zinc-700 dark:text-zinc-200">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
