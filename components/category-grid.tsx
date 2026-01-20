"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

type Category = { id: number; name: string; slug: string };
type Location = {
  id: number;
  name: string;
  slug: string;
  state: string | null;
};

const STORAGE_KEY = "user_preferred_city";

export function CategoryGrid({
  categories,
  locations,
}: {
  categories: Category[];
  locations: Location[];
}) {
  const [activeLocation, setActiveLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      const found = locations.find((l) => l.slug === saved);
      if (found) return found;
    }
    return locations[0];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const found = locations.find((l) => l.slug === saved);
      if (found) {
        setActiveLocation(found);
      }
    };

    window.addEventListener("city-preference-changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "city-preference-changed",
        handleStorageChange,
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [locations]);

  const handleLocationChange = (loc: Location) => {
    setActiveLocation(loc);

    localStorage.setItem(STORAGE_KEY, loc.slug);

    window.dispatchEvent(new Event("city-preference-changed"));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Explore {activeLocation.name}
        </h2>

        <div className="flex justify-center items-center gap-3">
          <span className="text-slate-500">I&apos;m looking for pros in:</span>
          <div className="relative group z-20">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full font-bold text-teal-700 shadow-sm hover:shadow-md transition-all">
              <MapPin className="w-4 h-4" />
              {activeLocation.name}, {activeLocation.state}
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 grid max-h-60 overflow-y-auto">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleLocationChange(loc)}
                  className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeLocation.id === loc.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {loc.name}, {loc.state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/directory/${activeLocation.slug}/${cat.slug}`}
            className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center mb-4 transition-colors duration-300">
              <span className="text-xl font-bold text-teal-700 group-hover:text-white transition-colors">
                {cat.name[0]}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              {cat.name}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Find {activeLocation.name} experts
            </p>

            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-teal-700 group-hover:text-amber-500 transition-colors">
              View Listings <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
