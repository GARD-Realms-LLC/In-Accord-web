"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AppShell from '../AppShell';

type User = any;
const POLL_INTERVAL = 10000;


function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Error boundary defined at module scope to avoid re-creation on each render
class UsersErrorBoundary extends React.Component<{}, { hasError: boolean; message?: string }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: err?.message || String(err) };
  }
  componentDidCatch(err: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('UsersPage render error', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-6">
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-800 p-4 rounded">
            <h2 className="font-semibold">Something went wrong rendering the Users page</h2>
            <div className="mt-2 text-sm">{this.state.message}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function UsersPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalUser, setModalUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ left: number; top: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      // Try same-origin API first (works when Next proxies to backend);
      // if that returns 404 or fails, fall back to backend at port 8000 for local dev.
      let res = await fetch('/api/admin/users', { signal });
      if (res.status === 404) {
        // fallback to backend server in dev
        try {
          res = await fetch('http://localhost:8000/api/admin/users', { signal });
        } catch (e) {
          // swallow and fall through to error handling below
        }
      }
      if (!res || !res.ok) throw new Error(`HTTP ${res ? res.status : 'NO_RESPONSE'}`);
      const data = await res.json();
      // server returns { ok: true, users: [...] } or an array — handle both
      if (Array.isArray(data)) setUsers(data);
      else if (data && Array.isArray(data.users)) setUsers(data.users);
      else setUsers([]);
      setError(null);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'Failed to load users');
      try { console.error('[UsersPage] fetchUsers error', err); } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    const id = setInterval(() => fetchUsers(), POLL_INTERVAL);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [fetchUsers]);

  // Close on Escape
  useEffect(() => {
    
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeUserModal();
    }
    if (typeof document !== 'undefined' && document?.addEventListener) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    return () => {};
  }, []);

  // Outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!isModalOpen) return;
      if (popoverRef.current && e.target instanceof Node && popoverRef.current.contains(e.target)) return;
      closeUserModal();
    }
    if (typeof document !== 'undefined' && document?.addEventListener) {
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }
    return () => {};
  }, [isModalOpen]);

  const openUserPopover = (u: User, ev?: React.MouseEvent) => {
    setModalUser(u);
    setIsModalOpen(true);
    if (ev && ev.currentTarget instanceof HTMLElement) {
      const target = ev.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setAnchorPos({ left: rect.left + rect.width / 2, top: rect.bottom });
    } else {
      setAnchorPos(null);
    }
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setModalUser(null);
    setAnchorPos(null);
  };

  // clamp popover to viewport after layout
  const [clampedPos, setClampedPos] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    if (!anchorPos || !popoverRef.current) {
      setClampedPos(null);
      return;
    }
    if (typeof window === 'undefined') {
      // can't measure on server — bail
      setClampedPos(null);
      return;
    }
    const pop = popoverRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = pop.getBoundingClientRect();
    const margin = 8;
    let left = anchorPos.left - rect.width / 2;
    let top = anchorPos.top + 8; // offset
    left = clamp(left, margin, vw - rect.width - margin);
    top = clamp(top, margin, vh - rect.height - margin);
    setClampedPos({ left, top });
  }, [anchorPos, isModalOpen]);

  const renderUserPopover = () => {
    if (!modalUser || !isModalOpen) return null;
    const stylePos = clampedPos || anchorPos;
    if (stylePos) {
      return (
        <div style={{ position: 'fixed', left: `${stylePos.left}px`, top: `${stylePos.top}px`, transform: 'translate(-50%, 8px)' }} className="z-50" role="dialog" aria-modal="true">
          <div ref={popoverRef} className="w-80 max-w-sm p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
            <div className="absolute left-1/2 -top-2 transform -translate-x-1/2">
              <div className="w-3 h-3 rotate-45 bg-gray-900 border-t border-l border-gray-700"></div>
            </div>
            <div className="relative">
              <button type="button" onClick={closeUserModal} className="absolute right-0 top-0 p-1 rounded hover:bg-gray-800" aria-label="Close">×</button>
              <div className="text-center">
                <div className="text-lg font-semibold">{modalUser.name || modalUser.username || 'Unnamed'}</div>
                {modalUser.company ? <div className="text-sm text-gray-400">{modalUser.company}</div> : null}
              </div>
              <div className="mt-3 flex justify-center">
                {modalUser.avatarUrl ? (
                  <img src={modalUser.avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center text-xl text-white">{(modalUser.name || modalUser.username || 'U').toString().slice(0,2).toUpperCase()}</div>
                )}
              </div>
              <div className="mt-3 text-center text-sm text-gray-300">{modalUser.description || modalUser.bio || ''}</div>
              <div className="mt-3 flex items-center justify-center gap-3">
                {modalUser.email ? <a href={`mailto:${modalUser.email}`} className="p-2 rounded bg-gray-800">Email</a> : null}
                <button onClick={() => { try { navigator.clipboard?.writeText((modalUser.id || modalUser.userId || modalUser.email || '').toString()); } catch {} }} className="p-2 rounded bg-gray-800">Copy ID</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // fallback centered panel
    return (
      <div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none" role="dialog" aria-modal="true">
        <div ref={popoverRef} className="pointer-events-auto w-80 max-w-sm p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
          <div className="relative">
            <button type="button" onClick={closeUserModal} className="absolute right-0 top-0 p-1 rounded hover:bg-gray-800">×</button>
            <div className="text-center">
              <div className="text-lg font-semibold">{modalUser.name || modalUser.username || 'Unnamed'}</div>
            </div>
            <div className="mt-3 text-center text-sm text-gray-300">{modalUser.description || modalUser.bio || ''}</div>
          </div>
        </div>
      </div>
    );
  };

  const UsersList: React.FC = () => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-400">Auto-refresh every 10s</div>
        <div className="text-sm text-gray-400">{loading ? 'Refreshing…' : `${users.length} users`}</div>
      </div>
      {error ? <div className="text-red-400 mb-2">{error}</div> : null}
      <ul className="space-y-2">
        {(() => {
          const list = Array.isArray(users) ? users : [];
          try {
            return list.map((u: User) => {
              const display = String(u?.name ?? u?.username ?? 'U').slice(0, 2).toUpperCase();
              const title = String(u?.name ?? u?.username ?? 'Unnamed');
              const sub = String(u?.role ?? u?.title ?? '');
              const key = String(u?.id ?? u?.userId ?? u?.email ?? u?.username ?? Math.random());
              return (
                <li key={key} className="p-2 bg-gray-800 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-sm text-white">{display}</div>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-xs text-gray-400">{sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => openUserPopover(u, e)} className="px-2 py-1 rounded bg-gray-700">View</button>
                  </div>
                </li>
              );
            });
          } catch (e) {
            console.error('[UsersPage] render list error', e);
            return <li className="p-2 text-red-400">Unable to render users list.</li>;
          }
        })()}
      </ul>
    </div>
  );
  
  

  // On the server render a minimal fallback. Once on the client, mount the Provider and Navbar
  if (!isClient) {
    return (
      <UsersErrorBoundary>
        <div className="min-h-screen">
          <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2 text-center">Developers and Users</h1>
            <p className="text-sm text-gray-400 mb-4 text-center">List of registered users in the system — click a user to view details.</p>
            <div className="p-4 bg-gray-900 rounded-lg shadow-sm">
              <UsersList />
            </div>
          </main>
          {renderUserPopover()}
        </div>
      </UsersErrorBoundary>
    );
  }

  // Client-only: render full app shell (includes Sidebar, Navbar, and StoreProvider)
  return (
    <UsersErrorBoundary>
      <AppShell>
        <main className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-2 text-center">Developers and Users</h1>
          <p className="text-sm text-gray-400 mb-4 text-center">List of registered users in the system — click a user to view details.</p>
          <div className="p-4 bg-gray-900 rounded-lg shadow-sm">
            <UsersList />
          </div>
        </main>
        {renderUserPopover()}
      </AppShell>
    </UsersErrorBoundary>
  );
}
