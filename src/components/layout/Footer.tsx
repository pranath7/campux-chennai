'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_CONFIG } from '@/lib/brandConfig';
import { GraduationCap, ShieldCheck, MapPin, ArrowUpRight, Mail, HelpCircle, FileText, Heart } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#FAF8F5] border-t border-stone-200 text-[#121316] text-xs pt-12 sm:pt-16 pb-12 w-full min-w-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-stone-200/80">
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full border border-stone-900 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-widest uppercase text-[#121316]">
                  {BRAND_CONFIG.name}
                </span>
                <span className="text-[9px] font-bold text-[#059669] tracking-widest uppercase -mt-0.5">
                  Chennai Academic Hub
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              The premier student academic marketplace & peer-learning network connecting top rankers across DG Vaishnav, Loyola, MCC, SRM, VIT, and Hindustan University.
            </p>
            
            <div className="flex items-center gap-2 text-stone-500 font-medium text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>Chennai, Tamil Nadu, India</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-widest text-stone-900">Marketplace</p>
            <ul className="space-y-2.5 text-stone-600 font-medium">
              <li>
                <Link href="/app" className="hover:text-black transition-colors block py-0.5">
                  Home Hub
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-black transition-colors block py-0.5">
                  Explore Notes
                </Link>
              </li>
              <li>
                <Link href="/study-groups" className="hover:text-black transition-colors block py-0.5">
                  Live Study Groups
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-black transition-colors block py-0.5">
                  Campus Opportunities
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-black transition-colors block py-0.5">
                  Sell Notes
                </Link>
              </li>
              <li>
                <Link href="/my-purchases" className="hover:text-black transition-colors block py-0.5">
                  My Purchases
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-widest text-stone-900">Support</p>
            <ul className="space-y-2.5 text-stone-600 font-medium">
              <li>
                <Link href="/how-it-works" className="hover:text-black transition-colors block py-0.5">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors block py-0.5">
                  About Platform
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="hover:text-black transition-colors block py-0.5">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <a href="mailto:support@campux.in" className="hover:text-black transition-colors block py-0.5">
                  Contact Support
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#059669] transition-colors flex items-center gap-1 py-0.5 font-bold">
                  <span>Admin Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-widest text-stone-900">Legal & Policy</p>
            <ul className="space-y-2.5 text-stone-600 font-medium">
              <li>
                <Link href="/trust-safety" className="hover:text-black transition-colors block py-0.5">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="hover:text-black transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="hover:text-black transition-colors block py-0.5">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="hover:text-black transition-colors block py-0.5">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & verification badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-medium text-center sm:text-left">
          <p>© 2026 {BRAND_CONFIG.name}. Built with pride for Chennai Student Communities.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#059669] font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Student Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
