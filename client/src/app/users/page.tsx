'use client';

import React, { useEffect, useState, useRef } from 'react';
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

  // Client-only users list component (polling-based, safe)
  const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
      mounted.current = true;
      const controller = new AbortController();

      const load = async (signal?: AbortSignal) => {
        try {
          setLoading(true);
          setError(null);
          const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'http://localhost:8000';
          const url = `${API_BASE.replace(/\/$/, '')}/api/admin/users`;
          const res = await fetch(url, { signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.users || data.data || [];
          if (!mounted.current) return;
          setUsers(list);
        } catch (e: any) {
          if (e?.name === 'AbortError') return;
          if (!mounted.current) return;
          setError(e?.message || 'Failed to load users');
        } finally {
          if (mounted.current) setLoading(false);
        }
      };

      // initial load
      load(controller.signal);

      // polling
      const pollInterval = 10000; // 10s
      const iv = setInterval(() => {
        const c = new AbortController();
        load(c.signal);
      }, pollInterval);

      return () => {
        mounted.current = false;
        controller.abort();
        clearInterval(iv);
      };
    }, []);

    if (loading) return <div id="users-root">Loading users...</div>;
    if (error) return <div id="users-root">Error loading users: {error}</div>;
    if (!users || users.length === 0) return <div id="users-root">No users found.</div>;

    return (
      <div id="users-root">
        <ul className="space-y-2">
          {users.map((u: any) => (
            <li key={u.id || u.userId || u.username || JSON.stringify(u)} className="p-2 bg-gray-800 rounded">
              <div className="text-sm font-medium">{u.name || u.username || u.email || 'Unnamed user'}</div>
              <div className="text-xs text-gray-400">{u.email || u.id || ''}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <StoreProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main style={{ padding: 16, paddingTop: topOffset }}>
            <h1>Users</h1>
            <section className="max-w-3xl mx-auto w-full">
              <div className="p-4 bg-gray-900 rounded-lg shadow-sm">
                <UsersList />
              </div>
            </section>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
