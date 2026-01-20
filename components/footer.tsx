import Link from "next/link";
import {
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { CopyrightYear } from "./copyrightYear";

export function Footer() {
  return (
    <footer className="relative bg-[#0c3937] text-teal-100/80 pt-12 pb-8 md:pt-20 md:pb-10 overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-10%] w-75 md:w-125 h-75 md:h-125 rounded-full bg-teal-500/10 blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-[-50%] right-[-10%] w-75 md:w-125 h-75 md:h-125 rounded-full bg-amber-500/10 blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16 border-b border-white/10 pb-12">
          <div className="col-span-2 md:col-span-5 lg:col-span-4 space-y-4 md:space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 fill-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Dir<span className="text-teal-200">ectory</span>.
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-teal-50/70">
              The #1 trusted platform for finding verified local experts. From
              coffee shops to legal advice, we connect you with the best.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="#" />
            </div>
          </div>

          {/* Links - Explore */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-white font-bold mb-4 md:mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/locations">Locations</FooterLink>
              <FooterLink href="/blog">Our Blog</FooterLink>
            </ul>
          </div>

          {/* Links - Support */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h4 className="text-white font-bold mb-4 md:mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/contact">Help Center</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/add-listing">Add Listing</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-12 lg:col-span-4 mt-4 md:mt-0">
            <h4 className="text-white font-bold mb-4 md:mb-6">Stay Updated</h4>
            <p className="text-sm mb-4 text-teal-50/70">
              Join 20,000+ subscribers getting the best local deals.
            </p>

            <form className="flex gap-2 mb-6 md:mb-8 max-w-md">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-teal-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all min-w-0"
              />
              <button
                type="button"
                className="bg-amber-500 hover:bg-amber-400 text-[#0c3937] font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-900/20 whitespace-nowrap"
              >
                Join
              </button>
            </form>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="break-all text-teal-50/80">
                  support@directory.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-teal-50/80">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-teal-100/60 text-center md:text-left">
          <p>
            &copy; <CopyrightYear /> Directory Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-teal-50/70 hover:text-amber-400 hover:translate-x-1 transition-all duration-200 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-teal-100 hover:bg-amber-500 hover:text-[#0c3937] hover:border-amber-500 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
