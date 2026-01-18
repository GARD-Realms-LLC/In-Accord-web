'use client';

import React, { useEffect } from 'react';
import StoreProvider from '../redux';
import Navbar from '../(components)/Navbar';
import Sidebar from '../(components)/Sidebar';

export default function UsersPageClient() {
  useEffect(() => {
    try {
      // Force dark mode for accessibility: apply class and persist preference
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('darkMode', 'true'); } catch {}

      // Inject strong CSS fallback to ensure dark backgrounds and readable text
      if (!document.getElementById('in-accord-force-dark')) {
        const s = document.createElement('style');
        s.id = 'in-accord-force-dark';
        s.innerHTML = `
          :root { color-scheme: dark; }
          html.dark, :root { background-color: #0b1220 !important; color: #e6eef8 !important; }
          body { background-color: transparent !important; color: inherit !important; }
          .min-h-screen { background-color: transparent !important; }
          .bg-white { background-color: transparent !important; }
          nav, .fixed { background-color: #0f1724 !important; color: #e6eef8 !important; }
          main { color: #e6eef8 !important; }
          a, button, input, textarea { color: inherit !important; }
        `;
        document.head.appendChild(s);
      }
    } catch {}

    const onStorage = (e) => {
      try {
        if (e.key === 'darkMode') {
          const v = e.newValue;
          if (v === 'true') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
        }
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Ensure main content is pushed below fixed navbar (approx height 72px)
  const topOffset = 72; // px

  return (
    <StoreProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main style={{ padding: 16, paddingTop: topOffset }}>
            <h1>Users</h1>
            <div id="users-root">Users content (client)</div>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
