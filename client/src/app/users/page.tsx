"use client";

/**
 * users page (client)
 *
 * Description:
 * Renders the Users page for the dashboard. This file contains a client-only
 * `UsersList` component that fetches the users list from the backend (polling
 * every 10s) and displays it inside a centered, narrow section. All UI and
 * network logic are intentionally scoped to this file so edits remain local.
 *
 * Behavior:
 * - Forces dark mode styles for accessibility fallbacks
 * - Uses AbortController and a mounted ref to safely cancel fetches
 * - Attempts to read `NEXT_PUBLIC_API_BASE_URL` and falls back to
 *   http://localhost:8000
 *
 * Edits to this file should be minimal and self-contained per project policy.
 *
 * Author: assistant
 * Date: 2026-01-19
 */

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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {u.avatarUrl || u.avatar || u.photo ? (
                      // avatar image
                      <img src={u.avatarUrl || u.avatar || u.photo} alt={u.name || u.username || 'User avatar'} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      // initials fallback
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                        {( (u.name || u.username || u.email || 'U').toString().split(' ').map(s=>s[0]).join('').slice(0,2) ).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{u.name || u.username || u.email || 'Unnamed user'}</div>
                    <div className="text-xs text-gray-400">{u.role || u.title || ''}</div>
                  </div>
                </div>

                <div className="flex-1 px-4 text-center">
                  <div className="text-sm text-gray-300 truncate italic">{(u.description || u.bio || u.about) ? `“${u.description || u.bio || u.about}”` : ''}</div>
                </div>

                <div className="flex items-center space-x-2">
                  {u.email ? (
                    <a href={`mailto:${u.email}`} title={`Email ${u.email}`} className="p-1 rounded hover:bg-gray-700">
                      {/* mail icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  ) : null}

                  <button
                    type="button"
                    title="Copy ID"
                    onClick={() => {
                      const text = (u.id || u.userId || u.email || '').toString();
                      try { navigator.clipboard?.writeText(text); } catch (err) { void err; }
                    }}
                    className="p-1 rounded hover:bg-gray-700"
                  >
                    {/* copy icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M8 8h8M5 20h14a1 1 0 001-1V7a1 1 0 00-1-1H9l-4 4v9a1 1 0 001 1z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    title="Details"
                    onClick={() => { try { console.log('show details', u); } catch (e) { } }}
                    className="p-1 rounded hover:bg-gray-700"
                  >
                    {/* info icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </button>
                  {
                    // always render github icon; if no url/handle present, render disabled/no-op
                    (() => {
                      const hasGH = !!(u.github || u.githubUrl || u.githubHandle);
                      const href = u.githubUrl || (u.github ? u.github : (u.githubHandle ? `https://github.com/${u.githubHandle}` : '#'));
                      return (
                        <a
                          href={href}
                          target={hasGH ? '_blank' : undefined}
                          rel={hasGH ? 'noopener noreferrer' : undefined}
                          title={hasGH ? 'GitHub' : 'No GitHub'}
                          onClick={(e) => { if (!hasGH) e.preventDefault(); }}
                          className="p-1 rounded hover:bg-gray-700 text-gray-300"
                        >
                          {/* github icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.95 3.2 9.14 7.64 10.62.56.1.76-.24.76-.53 0-.26-.01-.96-.01-1.88-3.11.68-3.77-1.5-3.77-1.5-.51-1.29-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .92 2.62.66 3.26.5.1-.39.39-.66.71-.81-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.4.11-2.92 0 0 .95-.3 3.12 1.15a10.8 10.8 0 012.84-.38c.96 0 1.93.13 2.84.38 2.17-1.45 3.12-1.15 3.12-1.15.61 1.52.23 2.64.11 2.92.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.64.77.53C19.06 20.88 22.25 16.69 22.25 11.75 22.25 5.48 17.27.5 12 .5z" />
                          </svg>
                        </a>
                      );
                    })()
                  }

                  {
                    // always render discord icon; copy to clipboard if value present, otherwise no-op with muted style
                    (() => {
                      const dval = (u.discord || u.discordTag || u.discordId);
                      const hasD = !!dval;
                      return (
                        <button
                          type="button"
                          title={hasD ? 'Copy Discord' : 'No Discord'}
                          onClick={() => { if (hasD) { try { navigator.clipboard?.writeText(dval.toString()); } catch (e) { } } }}
                          className={`p-1 rounded hover:bg-gray-700 text-gray-300 ${hasD ? '' : 'opacity-50 cursor-default'}`}
                        >
                          {/* discord icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.08.037c-.21.375-.444.864-.608 1.249-1.84-.276-3.68-.276-5.486 0-.165-.405-.41-.874-.632-1.249a.077.077 0 00-.08-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C2.58 9.02 1.675 13.42 2.16 17.773a.082.082 0 00.031.056 19.9 19.9 0 006.02 3.044.077.077 0 00.084-.027c.465-.639.878-1.312 1.226-2.017a.076.076 0 00-.041-.105 13.08 13.08 0 01-1.88-.892.075.075 0 01-.007-.127c.126-.094.252-.19.373-.291a.074.074 0 01.077-.01c3.927 1.792 8.18 1.792 12.061 0a.073.073 0 01.079.009c.12.1.247.197.374.291a.076.076 0 01-.006.127 12.98 12.98 0 01-1.88.893.076.076 0 00-.04.105c.36.705.773 1.378 1.227 2.017a.077.077 0 00.084.027 19.9 19.9 0 006.02-3.044.077.077 0 00.031-.056c.5-4.42-.45-8.79-2.927-13.377a.061.061 0 00-.03-.028zM8.02 15.331c-1.18 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419zm7.974 0c-1.18 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                          </svg>
                        </button>
                      );
                    })()
                  }
                </div>
              </div>
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
            <h1 className="text-2xl font-semibold mb-2 text-center">Developers and Users</h1>
            <p className="text-sm text-gray-400 mb-4 text-center">List of registered users in the system — auto-refreshes every 10 seconds. Click a user to view details (if available).</p>
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
