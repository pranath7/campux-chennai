'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { triggerHaptic } from '@/lib/haptics';
import {
  Home,
  ShoppingBag,
  Plus,
  FolderDown,
  User,
  Sparkles,
  Search,
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = user
    ? [
        {
          id: 'home',
          label: 'Home',
          href: '/app',
          icon: Home,
          isActive: pathname === '/app',
        },
        {
          id: 'explore',
          label: 'Explore',
          href: '/marketplace',
          icon: Search,
          isActive: pathname === '/marketplace' || pathname?.startsWith('/resources'),
        },
        {
          id: 'sell',
          label: 'Sell',
          href: '/sell',
          icon: Plus,
          isActive: pathname === '/sell',
          isHighlight: true,
        },
        {
          id: 'purchases',
          label: 'Purchases',
          href: '/my-purchases',
          icon: FolderDown,
          isActive: pathname === '/my-purchases',
        },
        {
          id: 'profile',
          label: 'Profile',
          href: '/profile',
          icon: User,
          isActive: pathname === '/profile' || pathname === '/seller',
        },
      ]
    : [
        {
          id: 'home',
          label: 'Home',
          href: '/',
          icon: Home,
          isActive: pathname === '/',
        },
        {
          id: 'explore',
          label: 'Explore',
          href: '/marketplace',
          icon: Search,
          isActive: pathname === '/marketplace' || pathname?.startsWith('/resources'),
        },
        {
          id: 'roadmap',
          label: 'AI Roadmap',
          href: '/coming-soon',
          icon: Sparkles,
          isActive: pathname === '/coming-soon',
        },
        {
          id: 'sell',
          label: 'Sell',
          href: '/login?redirect=/sell',
          icon: Plus,
          isActive: pathname === '/sell',
        },
        {
          id: 'login',
          label: 'Login',
          href: '/login',
          icon: User,
          isActive: pathname === '/login',
          isHighlight: true,
        },
      ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHighlight = item.isHighlight;

          if (isHighlight && user) {
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                onClick={() => triggerHaptic('medium')}
                className="flex flex-col items-center justify-center -mt-6 group min-w-[56px] focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 ${
                    item.isActive
                      ? 'bg-stone-900 ring-4 ring-emerald-500/25'
                      : 'bg-[#059669] hover:bg-[#047857]'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-800 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              onClick={() => triggerHaptic('selection')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] focus:outline-none ${
                item.isActive
                  ? 'text-[#059669] font-black scale-105'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  item.isActive ? 'bg-emerald-50 text-[#059669]' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${item.isActive ? 'font-black text-[#059669]' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
