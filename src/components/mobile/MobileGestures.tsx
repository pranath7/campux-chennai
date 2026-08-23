'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { triggerHaptic } from '@/lib/haptics';
import { RotateCw, ArrowLeft, Eye, Bookmark, Share2, Sparkles, X } from 'lucide-react';

interface MobileGesturesProps {
  children: React.ReactNode;
}

export function MobileGestures({ children }: MobileGesturesProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Pull to Refresh State
  const [pullY, setPullY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isAtTop = useRef(false);

  // 2. Swipe to Go Back State
  const touchStartX = useRef(0);
  const [edgeSwipeProgress, setEdgeSwipeProgress] = useState(0);
  const isEdgeSwipe = useRef(false);

  // 3. Gesture Discovery Hint
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show gesture hint once on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      const hasSeenHint = localStorage.getItem('campux_mobile_gesture_hint_v1');
      if (!hasSeenHint) {
        const timer = setTimeout(() => setShowHint(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    triggerHaptic('light');
    if (typeof window !== 'undefined') {
      localStorage.setItem('campux_mobile_gesture_hint_v1', 'true');
    }
  };

  // Global Touch Listeners for Pull to Refresh & Edge Swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchStartX.current = touch.clientX;

      // Check if page is scrolled to top for pull-to-refresh
      isAtTop.current = window.scrollY <= 2;

      // Check if swipe started within 35px of left screen edge (Swipe to go back)
      if (touch.clientX <= 35 && window.history.length > 1 && pathname !== '/' && pathname !== '/app') {
        isEdgeSwipe.current = true;
      } else {
        isEdgeSwipe.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStartY.current;
      const deltaX = touch.clientX - touchStartX.current;

      // Edge Swipe to Go Back
      if (isEdgeSwipe.current && deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const progress = Math.min(100, deltaX * 0.6);
        setEdgeSwipeProgress(progress);
        if (progress > 60 && edgeSwipeProgress <= 60) {
          triggerHaptic('selection');
        }
      }

      // Pull to Refresh
      if (isAtTop.current && deltaY > 10 && deltaY > Math.abs(deltaX) && !isRefreshing) {
        setIsPulling(true);
        // Rubber-band resistance curve
        const resistedY = Math.min(90, deltaY * 0.45);
        setPullY(resistedY);

        if (resistedY >= 75 && pullY < 75) {
          triggerHaptic('medium');
        }
      }
    };

    const handleTouchEnd = () => {
      // Handle Edge Swipe Trigger
      if (isEdgeSwipe.current && edgeSwipeProgress >= 65) {
        triggerHaptic('success');
        router.back();
      }
      isEdgeSwipe.current = false;
      setEdgeSwipeProgress(0);

      // Handle Pull to Refresh Trigger
      if (isPulling) {
        if (pullY >= 75) {
          setIsRefreshing(true);
          triggerHaptic('success');
          setPullY(55);

          // Perform smooth client refresh
          setTimeout(() => {
            router.refresh();
            setIsRefreshing(false);
            setPullY(0);
            setIsPulling(false);
          }, 800);
        } else {
          setPullY(0);
          setIsPulling(false);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullY, edgeSwipeProgress, isRefreshing, isPulling, pathname, router]);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* 1. Pull to Refresh Visual Indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${pullY}px)` }}
        >
          <div className="bg-stone-900/90 backdrop-blur-md text-emerald-400 p-2.5 rounded-full shadow-xl border border-stone-700 flex items-center justify-center gap-2">
            <RotateCw className={`w-4 h-4 ${isRefreshing || pullY >= 75 ? 'animate-spin' : ''}`} />
            {pullY >= 75 && !isRefreshing && (
              <span className="text-[10px] font-bold text-white pr-1">Release to refresh</span>
            )}
            {isRefreshing && (
              <span className="text-[10px] font-bold text-emerald-400 pr-1">Updating...</span>
            )}
          </div>
        </div>
      )}

      {/* 2. Swipe to Go Back Visual Edge Pill */}
      {edgeSwipeProgress > 10 && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-all flex items-center"
          style={{ transform: `translateX(${edgeSwipeProgress - 35}px)` }}
        >
          <div
            className={`p-3 rounded-r-2xl shadow-2xl border-y border-r flex items-center gap-1.5 transition-colors ${
              edgeSwipeProgress >= 65
                ? 'bg-[#059669] text-white border-emerald-500 scale-110'
                : 'bg-stone-900/90 text-stone-300 border-stone-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      )}

      {/* 3. Gesture Hints Discovery Pill */}
      {showHint && (
        <aside
          aria-label="Mobile Navigation Tip"
          className="fixed bottom-20 left-4 right-4 z-40 bg-stone-900/95 text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-3 animate-slide-up backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-emerald-400 text-[11px] leading-tight">Mobile Gestures Enabled</p>
              <p className="text-[10px] text-stone-300">Swipe from left edge to go back • Pull down to refresh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissHint}
            className="w-6 h-6 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center shrink-0"
            aria-label="Dismiss Gesture Tip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {children}
    </div>
  );
}

/**
 * 4. Interactive Swipeable & Long-Press Card Wrapper
 */
export function SwipeableCardItem({
  children,
  onQuickPreview,
  onBookmark,
  onShare,
}: {
  children: React.ReactNode;
  onQuickPreview?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const startX = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    // Long Press Menu Trigger (450ms)
    longPressTimer.current = setTimeout(() => {
      triggerHaptic('heavy');
      setShowContextMenu(true);
    }, 450);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;

    // If moving horizontally, cancel long press
    if (Math.abs(diff) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Allow left swipe up to -120px to reveal actions
    if (diff < 0) {
      setOffsetX(Math.max(-120, diff));
    } else if (offsetX < 0) {
      setOffsetX(Math.min(0, offsetX + diff));
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (offsetX <= -60) {
      triggerHaptic('light');
      setOffsetX(-120); // Keep action drawer exposed
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl group touch-pan-y">
      {/* Revealed Swipe Quick Actions Drawer */}
      <div className="absolute inset-y-0 right-0 w-[120px] bg-stone-900 flex items-center justify-around px-2 z-0">
        {onQuickPreview && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              setOffsetX(0);
              onQuickPreview();
            }}
            className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {onBookmark && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setOffsetX(0);
              onBookmark();
            }}
            className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs"
            title="Save for Later"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}
        {onShare && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setOffsetX(0);
              onShare();
            }}
            className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Draggable / Long-pressable Content Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 bg-white dark:bg-stone-900 transition-transform duration-150 ease-out"
        style={{ transform: `translateX(${offsetX}px)` }}
      >
        {children}
      </div>

      {/* Long-Press Bottom Sheet Context Menu */}
      {showContextMenu && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Actions"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowContextMenu(false)}
        >
          <div
            className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[24px] p-5 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-2" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider text-center">
              Quick Actions
            </h3>
            <div className="space-y-1.5 pt-2">
              {onQuickPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setShowContextMenu(false);
                    onQuickPreview();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 text-left transition-colors"
                >
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Open PDF Preview</span>
                </button>
              )}
              {onBookmark && (
                <button
                  type="button"
                  onClick={() => {
                    setShowContextMenu(false);
                    onBookmark();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 text-left transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span>Bookmark Resource</span>
                </button>
              )}
              {onShare && (
                <button
                  type="button"
                  onClick={() => {
                    setShowContextMenu(false);
                    onShare();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 text-left transition-colors"
                >
                  <Share2 className="w-4 h-4 text-sky-600" />
                  <span>Share Resource Link</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowContextMenu(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
