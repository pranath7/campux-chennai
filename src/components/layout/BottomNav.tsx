'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { triggerHaptic } from '@/lib/haptics';
import {
  Home,
  ShoppingBag,
  PlusCircle,
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
          icon: PlusCircle,
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
          icon: PlusCircle,
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/98 dark:bg-stone-900/98 backdrop-blur-lg border-t border-stone-200/90 dark:border-stone-800 px-2 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHighlight = item.isHighlight;

          if (isHighlight && user) {
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => triggerHaptic('medium')}
                className="flex flex-col items-center justify-center -mt-5 group min-w-[56px] min-h-[44px]"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${
                    item.isActive
                      ? 'bg-black ring-4 ring-emerald-400/40'
                      : 'bg-[#059669] hover:bg-[#047857]'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => triggerHaptic('selection')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[54px] min-h-[44px] ${
                item.isActive
                  ? 'text-[#059669] dark:text-emerald-400 font-bold scale-105'
                  : 'text-stone-500 dark:text-stone-400 font-medium hover:text-stone-900'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  item.isActive ? 'bg-emerald-50 dark:bg-emerald-950/60' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-wide mt-0.5 font-semibold leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
