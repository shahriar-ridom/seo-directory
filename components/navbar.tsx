"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled
            ? "bg-[#0c3937]/80 backdrop-blur-md border-white/10 py-3 shadow-lg"
            : "bg-transparent py-5",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Dir<span className="text-teal-200">ectory</span>.
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          <div className="hidden md:block">
            <Link
              href="/add-listing"
              className="px-6 py-2.5 rounded-full bg-white text-[#0c3937] font-bold text-sm hover:bg-amber-400 hover:text-white transition-colors duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              Add Listing
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-teal-100 hover:text-white p-2 relative z-50"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#0c3937] pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden flex flex-col h-dvh",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col gap-6 text-center h-full overflow-y-auto pb-10">
          <MobileLink href="/" onClick={() => setIsOpen(false)}>
            Home
          </MobileLink>
          <MobileLink href="/about" onClick={() => setIsOpen(false)}>
            About Us
          </MobileLink>
          <MobileLink href="/categories" onClick={() => setIsOpen(false)}>
            Browse Categories
          </MobileLink>
          <MobileLink href="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </MobileLink>

          <hr className="border-white/10 my-2" />

          <Link
            href="/add-listing"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-amber-600 text-white font-bold text-lg active:scale-95 transition-transform mt-auto mb-8"
          >
            Add Your Listing <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-teal-100/80 hover:text-white transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 rounded-full group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-2xl font-bold text-white hover:text-amber-400 transition-colors py-2 border-b border-white/5"
    >
      {children}
    </Link>
  );
}
