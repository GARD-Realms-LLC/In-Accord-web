"use client";
import React, { useEffect, useState } from 'react';
import StoreProvider from './redux';

// Render children only after client mount to avoid hydration mismatches.
// This is a minimal, non-destructive guard that prevents server/client
// markup differences from causing runtime hydration errors.
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  return <StoreProvider>{children}</StoreProvider>;
}
