"use client";

import { useState, useEffect } from "react";

export function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setYear(new Date().getFullYear());
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!year) return null;

  return <span>{year}</span>;
}
