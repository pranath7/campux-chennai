'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Listing } from '@/types/marketplace';
import { ResourceCard } from '@/components/marketplace/ResourceCard';
import { PreviewModal } from '@/components/marketplace/PreviewModal';
import { CheckoutModal } from '@/components/marketplace/CheckoutModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  GraduationCap,
  Building,
  RotateCcw,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function MarketplaceContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCollege, setSelectedCollege] = useState(searchParams.get('collegeId') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [maxPrice, setMaxPrice] = useState('500');

  // Modals & Mobile Filter Drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<Listing | null>(null);
  const [selectedBuy, setSelectedBuy] = useState<Listing | null>(null);

  // Auth Route Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/marketplace');
    }
  }, [user, authLoading, router]);

  // Load Colleges & Listings
  useEffect(() => {
    fetch('/api/colleges')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setColleges(d.colleges);
      })
      .catch(console.error);
  }, []);

  const fetchListings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCollege) params.set('collegeId', selectedCollege);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedYear) params.set('year', selectedYear);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sort', sortBy);

    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setListings(d.listings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCollege, selectedCategory, selectedYear, sortBy, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCollege('');
    setSelectedCategory('');
    setSelectedYear('');
    setSortBy('recommended');
    setMaxPrice('500');
  };

  const categories = ['Revision Notes', 'PYQ Solutions', 'Formula Sheet', 'Summary Guide', 'Case Study Notes'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 text-[#121316]">
      {/* Header */}
      <div className="space-y-2 sm:space-y-4">
        <div className="inline-block bg-[#E8E1D5] px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-800">
          Peer Academic Vault
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316] break-words leading-tight">
          Chennai Academic Marketplace
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
          Access high-scoring notes, solved university question papers, and cheat sheets authored exclusively by verified students across Chennai colleges.
        </p>
      </div>

      {/* Main Search & College Quick Filter Bar */}
      <div className="warm-card rounded-[22px] sm:rounded-[26px] p-3.5 sm:p-6 space-y-3 sm:space-y-4 bg-white border border-stone-200 w-full min-w-0">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl sm:rounded-full p-1.5 sm:pl-3.5 focus-within:border-stone-900 transition-colors w-full min-w-0">
          <div className="flex items-center flex-1 min-w-0 px-2 py-1 sm:py-0">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, subjects, topics..."
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium min-w-0"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#121316] hover:bg-black text-white px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0 text-center"
          >
            Search Notes
          </button>
        </form>

        {/* Quick College Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar w-full min-w-0">
          <span className="text-[10px] font-bold uppercase text-stone-400 shrink-0">Campus:</span>
          <button
            onClick={() => setSelectedCollege('')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCollege === ''
                ? 'bg-[#121316] text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            All
          </button>
          {colleges.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCollege(c.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCollege === c.id
                  ? 'bg-[#121316] text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {c.shortName || c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-xs w-full min-w-0">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer min-h-[40px] px-3"
        >
          <Filter className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{mobileFilterOpen ? 'Close' : 'Filter & Sort'}</span>
          {(selectedCategory || selectedYear || selectedCollege) && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          )}
        </button>
        {(selectedCategory || selectedYear || selectedCollege) && (
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer min-h-[40px] shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Left Filters Sidebar */}
        <div className={`lg:col-span-1 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="warm-card rounded-[24px] p-6 space-y-6 bg-white border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-stone-600" /> Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-stone-500 hover:text-black flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-medium focus:outline-hidden"
              >
                <option value="recommended">Recommended & Verified</option>
                <option value="rating">Highest Student Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="sales">Most Popular</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Category
              </label>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#E6F4EA] text-[#059669] font-bold border border-[#A8DAB5]'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Year */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Academic Year
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['1', '2', '3', '4'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(selectedYear === yr ? '' : yr)}
                    className={`py-1.5 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-[#121316] text-white border-[#121316]'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    Yr {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex justify-between text-xs font-bold text-stone-800">
                <span className="text-[10px] uppercase tracking-wider text-stone-400">Max Budget</span>
                <span>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[#059669]"
              />
            </div>
          </div>
        </div>

        {/* Right Listings Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium pb-2 border-b border-stone-200">
            <span>
              Showing <strong>{listings.length}</strong> academic resources
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="warm-card rounded-[24px] p-6 h-64 animate-pulse bg-stone-100/70" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="warm-card rounded-[24px] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">No resources found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try loosening your filters or search keywords to explore notes across all Chennai colleges.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-full bg-stone-900 text-white font-bold text-xs uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((listing) => (
                <ResourceCard
                  key={listing.id}
                  listing={listing}
                  onPreview={(item) => setSelectedPreview(item)}
                  onBuy={(item) => setSelectedBuy(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedPreview && (
        <PreviewModal
          listing={selectedPreview}
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          onBuy={(item) => {
            setSelectedPreview(null);
            setSelectedBuy(item);
          }}
        />
      )}

      {selectedBuy && (
        <CheckoutModal
          listing={selectedBuy}
          isOpen={!!selectedBuy}
          onClose={() => setSelectedBuy(null)}
          onSuccess={() => {
            setSelectedBuy(null);
            fetchListings();
          }}
        />
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading Marketplace Catalog...</p>
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
