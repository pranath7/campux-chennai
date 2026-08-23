'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/lib/brandConfig';
import {
  GraduationCap,
  Bell,
  ShoppingBag,
  Building,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export function Navbar() {
  const { user, notifications, unreadNotifsCount, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Public navigation links (When NOT logged in)
  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Roadmap & AI', href: '/coming-soon' },
    { name: 'Trust & Safety', href: '/trust-safety' },
  ];

  // Logged-in navigation links (When LOGGED IN)
  const appLinks = [
    { name: 'Home', href: '/app' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Study Groups', href: '/study-groups' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'My Purchases', href: '/my-purchases' },
    { name: 'Sell Notes', href: '/sell' },
    { name: 'AI Roadmap', href: '/coming-soon' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 text-[#121316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href={user ? '/app' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full border border-stone-900 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-widest uppercase text-[#121316]">
                  {BRAND_CONFIG.shortName}
                </span>
                <span className="text-[9px] font-bold text-[#059669] tracking-widest uppercase -mt-0.5">
                  Chennai
                </span>
              </div>
            </Link>

            {/* Active College Badge (Logged In) */}
            {user?.profile?.collegeId && (
              <div className="hidden xl:flex items-center gap-1.5 bg-stone-100/80 border border-stone-200 px-3 py-1 rounded-full text-xs text-stone-600 font-medium">
                <Building className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-stone-900 font-semibold">{user.college?.shortName || user.college?.name || 'DG Vaishnav'}</span>
                {user.profile.section && (
                  <span className="text-[10px] text-stone-400 font-bold">Sec {user.profile.section}</span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {(user ? appLinks : publicLinks).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors py-2 ${
                    isActive
                      ? 'text-black border-b-2 border-black'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Area */}
          <div className="flex items-center gap-3">
            {user ? (
              // LOGGED IN USER ACTIONS
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
                    className="w-10 h-10 rounded-full border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-700 hover:text-black transition-all relative cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-[#059669] rounded-full ring-2 ring-white" />
                    )}
                  </button>

                  {notifPopoverOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-2xl z-50 p-4 text-stone-900 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                        <span className="font-bold text-xs uppercase tracking-wider text-stone-500">
                          Notifications
                        </span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 mt-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-stone-400 py-4 text-center">No new notifications</p>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className="py-2.5">
                              <p className="font-bold text-xs text-stone-900">{notif.title}</p>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
                              <span className="text-[10px] text-stone-400 mt-1 block">Just now</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 group"
                  title="My Profile"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-stone-300 group-hover:border-stone-900 transition-colors"
                  />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-full border border-stone-200 hover:border-stone-400 bg-white hidden sm:flex items-center justify-center text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              // PUBLIC VISITOR ACTIONS
              <>
                <Link
                  href="/login?redirect=/sell"
                  className="text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black px-3 py-2 transition-colors hidden sm:inline-block"
                >
                  Sell Notes
                </Link>

                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black px-3 py-2 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/login?redirect=/app"
                  className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Buy Notes</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF8F5] px-6 py-5 space-y-4">
          {(user ? appLinks : publicLinks).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-bold uppercase tracking-wider text-stone-800 hover:text-black"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-stone-200 text-stone-800 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-center block"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login?redirect=/app"
                  className="w-full bg-[#059669] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider text-center block"
                >
                  Buy Notes
                </Link>
                <Link
                  href="/login?redirect=/sell"
                  className="w-full bg-white border border-stone-200 text-stone-800 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-center block"
                >
                  Sell Notes
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
