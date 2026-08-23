'use client';

import React from 'react';

interface MobileGesturesProps {
  children: React.ReactNode;
}

export function MobileGestures({ children }: MobileGesturesProps) {
  return (
    <div className="w-full max-w-[100vw] min-h-screen flex flex-col overflow-x-clip">
      {children}
    </div>
  );
}

export function SwipeableCardItem({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-full min-w-0">{children}</div>;
}
