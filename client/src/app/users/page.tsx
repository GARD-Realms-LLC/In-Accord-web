"use client";

import React, { useEffect, useRef, useState } from 'react';
import StoreProvider from '../redux';
import Navbar from '../(components)/Navbar';
import Sidebar from '../(components)/Sidebar';

export default function UsersPageClient() {
  // Force dark mode and inject a minimal fallback stylesheet for contrast
  useEffect(() => {
    try {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('darkMode', 'true'); } catch {}
      if (!document.getElementById('in-accord-force-dark')) {
        const s = document.createElement('style');
        s.id = 'in-accord-force-dark';
        s.innerHTML = `
          :root { color-scheme: dark; }
          html.dark, :root { background-color: #0b1220 !important; color: #e6eef8 !important; }
          nav, .fixed { background-color: #0f1724 !important; color: #e6eef8 !important; }
        `;
        document.head.appendChild(s);
      }
    } catch {}
  }, []);

  const topOffset = 72;

  const [modalUser, setModalUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [anchorPos, setAnchorPos] = useState<{ left: number; top: number } | null>(null);

  const openUserModal = (u: any, anchor?: HTMLElement | null) => {
    try {
      if (anchor && typeof window !== 'undefined') {
        const r = anchor.getBoundingClientRect();
        setAnchorPos({ left: Math.round(r.left + r.width / 2), top: Math.round(r.bottom + window.scrollY) });
      } else {
        setAnchorPos(null);
      }
    } catch {}
    setModalUser(u);
    setIsModalOpen(true);
  };
  const closeUserModal = () => { setIsModalOpen(false); setTimeout(() => { setModalUser(null); setAnchorPos(null); }, 120); };

  // close on Escape
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeUserModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  // close on outside click
  useEffect(() => {
    if (!isModalOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (modalRef.current && t && !modalRef.current.contains(t)) closeUserModal();
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [isModalOpen]);

  const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
          const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/admin/users`, { signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.users || data.data || [];
          if (!mounted.current) return;
          setUsers(list);
        } catch (e: any) {
          if (e?.name === 'AbortError') return;
          if (!mounted.current) return;
          setError(e?.message || 'Failed to load users');
        } finally { if (mounted.current) setLoading(false); }
      };

      load(controller.signal);
      const iv = setInterval(() => { const c = new AbortController(); load(c.signal); }, 10000);
      return () => { mounted.current = false; controller.abort(); clearInterval(iv); };
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
                  <div className="shrink-0">
                    {u.avatarUrl || u.avatar || u.photo ? (
                      <button type="button" onClick={(e) => openUserModal(u, e.currentTarget as HTMLElement)} className="h-8 w-8 rounded-full overflow-hidden p-0 border-0 bg-transparent">
                        <img src={u.avatarUrl || u.avatar || u.photo} alt={u.name || u.username || 'User avatar'} className="h-8 w-8 rounded-full object-cover" />
                      </button>
                    ) : (
                      <button type="button" onClick={(e) => openUserModal(u, e.currentTarget as HTMLElement)} className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                        {( (u.name || u.username || u.email || 'U').toString().split(' ').map((s: string) => s[0]).join('').slice(0,2) ).toUpperCase()}
                      </button>
                    )}
                  </div>

                  <div>
                    <button type="button" onClick={(e) => openUserModal(u, e.currentTarget as HTMLElement)} className="text-sm font-medium text-left hover:underline">
                      {u.name || u.username || u.email || 'Unnamed user'}
                    </button>
                    <div className="text-xs text-gray-400">{u.role || u.title || ''}</div>
                  </div>
                </div>

                <div className="flex-1 px-4 text-center">
                  <div className="text-sm text-gray-300 truncate italic">{(u.description || u.bio || u.about) ? `“${u.description || u.bio || u.about}”` : ''}</div>
                </div>

                <div className="flex items-center space-x-2">
                  {u.email ? (
                    <a href={`mailto:${u.email}`} title={`Email ${u.email}`} className="p-1 rounded hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  ) : null}

                  <button type="button" title="Copy ID" onClick={() => { const text = (u.id || u.userId || u.email || '').toString(); try { navigator.clipboard?.writeText(text); } catch {} }} className="p-1 rounded hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M8 8h8M5 20h14a1 1 0 001-1V7a1 1 0 00-1-1H9l-4 4v9a1 1 0 001 1z" />
                    </svg>
                  </button>

                  <button type="button" title="Details" onClick={() => { try { console.log('show details', u); } catch {} }} className="p-1 rounded hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </button>

                  <a href={u.githubUrl || (u.githubHandle ? `https://github.com/${u.githubHandle}` : '#')} target={u.githubUrl || u.githubHandle ? '_blank' : undefined} rel={u.githubUrl || u.githubHandle ? 'noopener noreferrer' : undefined} title="GitHub" className="p-1 rounded hover:bg-gray-700 text-gray-300" onClick={(e) => { if (!u.githubUrl && !u.githubHandle) e.preventDefault(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.95 3.2 9.14 7.64 10.62.56.1.76-.24.76-.53 0-.26-.01-.96-.01-1.88-3.11.68-3.77-1.5-3.77-1.5-.51-1.29-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .92 2.62.66 3.26.5.1-.39.39-.66.71-.81-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.4.11-2.92 0 0 .95-.3 3.12 1.15a10.8 10.8 0 012.84-.38c.96 0 1.93.13 2.84.38 2.17-1.45 3.12-1.15 3.12-1.15.61 1.52.23 2.64.11 2.92.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.64.77.53C19.06 20.88 22.25 16.69 22.25 11.75 22.25 5.48 17.27.5 12 .5z" />
                    </svg>
                  </a>

                  <button type="button" title={u.discord || u.discordTag ? 'Copy Discord' : 'No Discord'} onClick={() => { if (u.discord || u.discordTag) { try { navigator.clipboard?.writeText((u.discord || u.discordTag).toString()); } catch {} } }} className={`p-1 rounded hover:bg-gray-700 text-gray-300 ${u.discord || u.discordTag ? '' : 'opacity-50 cursor-default'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.08.037c-.21.375-.444.864-.608 1.249-1.84-.276-3.68-.276-5.486 0-.165-.405-.41-.874-.632-1.249a.077.077 0 00-.08-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C2.58 9.02 1.675 13.42 2.16 17.773a.082.082 0 00.031.056 19.9 19.9 0 006.02 3.044.077.077 0 00.084-.027c.465-.639.878-1.312 1.226-2.017a.076.076 0 00-.041-.105 13.08 13.08 0 01-1.88-.892.075.075 0 01-.007-.127c.126-.094.252-.19.373-.291a.074.074 0 01.077-.01c3.927 1.792 8.18 1.792 12.061 0a.073.073 0 01.079.009c.12.1.247.197.374.291a.076.076 0 01-.006.127 12.98 12.98 0 01-1.88.893.076.076 0 00-.04.105c.36.705.773 1.378 1.227 2.017a.077.077 0 00.084.027 19.9 19.9 0 006.02-3.044.077.077 0 00.031-.056c.5-4.42-.45-8.79-2.927-13.377a.061.061 0 00-.03-.028zM8.02 15.331c-1.18 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419zm7.974 0c-1.18 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                    </svg>
                  </button>
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

            {isModalOpen && modalUser ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
                <div ref={modalRef} className="w-80 max-w-sm p-5 bg-gray-900 rounded-xl shadow-2xl border border-gray-700">
                  <div className="relative">
                    <button type="button" onClick={closeUserModal} className="absolute right-0 top-0 p-1 rounded hover:bg-gray-800" aria-label="Close">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <div className="text-center">
                      <div className="text-lg font-semibold">{(modalUser.name || modalUser.username || 'Unnamed')}</div>
                      {modalUser.company ? <div className="text-sm text-gray-400">{modalUser.company}</div> : null}
                    </div>

                    <div className="mt-4 flex justify-center">
                      {modalUser.avatarUrl || modalUser.avatar || modalUser.photo ? (
                        <img src={modalUser.avatarUrl || modalUser.avatar || modalUser.photo} alt={modalUser.name || modalUser.username || 'Avatar'} className="h-24 w-24 rounded-full object-cover" />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white">
                          {((modalUser.name || modalUser.username || 'U').toString().split(' ').map((s: string) => s[0]).join('').slice(0,2)).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      {modalUser.description || modalUser.bio || modalUser.about ? (
                        <div className="text-sm text-gray-300 italic">“{modalUser.description || modalUser.bio || modalUser.about}”</div>
                      ) : null}
                      <div className="text-sm text-gray-300 mt-2">&quot;{modalUser.longRole || modalUser.fullRole || modalUser.role || ''}&quot;</div>
                    </div>

                    <div className="mt-4 border-t border-gray-800 pt-3 flex items-center justify-center gap-3">
                      {/* Email */}
                      <a href={modalUser.email ? `mailto:${modalUser.email}` : '#'} title={modalUser.email ? `Email ${modalUser.email}` : 'No email'} className={`p-2 rounded bg-gray-800 hover:bg-gray-700 ${modalUser.email ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={(e) => { if (!modalUser.email) e.preventDefault(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>

                      {/* Copy ID */}
                      <button type="button" title="Copy ID" onClick={() => { try { navigator.clipboard?.writeText((modalUser.id || modalUser.userId || modalUser.email || modalUser.username || '').toString()); } catch {} }} className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M8 8h8M5 20h14a1 1 0 001-1V7a1 1 0 00-1-1H9l-4 4v9a1 1 0 001 1z" />
                        </svg>
                      </button>

                      {/* Details */}
                      <button type="button" title="Details" onClick={() => { try { console.log('show details', modalUser); } catch {} }} className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                      </button>

                      {/* GitHub */}
                      <a href={(modalUser.githubUrl || modalUser.github || (modalUser.githubHandle ? `https://github.com/${modalUser.githubHandle}` : '#'))} target={(modalUser.githubUrl || modalUser.github || modalUser.githubHandle) ? '_blank' : undefined} rel={(modalUser.githubUrl || modalUser.github || modalUser.githubHandle) ? 'noopener noreferrer' : undefined} title={modalUser.github || modalUser.githubUrl || modalUser.githubHandle ? 'GitHub' : 'No GitHub'} className={`p-2 rounded bg-gray-800 hover:bg-gray-700 ${modalUser.github || modalUser.githubUrl || modalUser.githubHandle ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={(e) => { if (!(modalUser.githubUrl || modalUser.github || modalUser.githubHandle)) e.preventDefault(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.95 3.2 9.14 7.64 10.62.56.1.76-.24.76-.53 0-.26-.01-.96-.01-1.88-3.11.68-3.77-1.5-3.77-1.5-.51-1.29-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .92 2.62.66 3.26.5.1-.39.39-.66.71-.81-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.4.11-2.92 0 0 .95-.3 3.12 1.15a10.8 10.8 0 012.84-.38c.96 0 1.93.13 2.84.38 2.17-1.45 3.12-1.15 3.12-1.15.61 1.52.23 2.64.11 2.92.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.64.77.53C19.06 20.88 22.25 16.69 22.25 11.75 22.25 5.48 17.27.5 12 .5z" />
                        </svg>
                      </a>

                      {/* Discord (copy) */}
                      <button type="button" title={modalUser.discord || modalUser.discordTag ? 'Copy Discord' : 'No Discord'} onClick={() => { try { const v = modalUser.discord || modalUser.discordTag || modalUser.username || ''; if (v) navigator.clipboard?.writeText(v); } catch {} }} className={`p-2 rounded bg-gray-800 hover:bg-gray-700 ${!(modalUser.discord || modalUser.discordTag || modalUser.username) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.08.037c-.21.375-.444.864-.608 1.249-1.84-.276-3.68-.276-5.486 0-.165-.405-.41-.874-.632-1.249a.077.077 0 00-.08-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C2.58 9.02 1.675 13.42 2.16 17.773a.082.082 0 00.031.056 19.9 19.9 0 006.02 3.044.077.077 0 00.084-.027c.465-.639.878-1.312 1.226-2.017a.076.076 0 00-.041-.105 13.08 13.08 0 01-1.88-.892.075.075 0 01-.007-.127c.126-.094.252-.19.373-.291a.074.074 0 01.077-.01c3.927 1.792 8.18 1.792 12.061 0a.073.073 0 01.079.009c.12.1.247.197.374.291a.076.076 0 01-.006.127 12.98 12.98 0 01-1.88.893.076.076 0 00-.04.105c.36.705.773 1.378 1.227 2.017a.077.077 0 00.084.027 19.9 19.9 0 006.02-3.044.077.077 0 00.031-.056c.5-4.42-.45-8.79-2.927-13.377a.061.061 0 00-.03-.028zM8.02 15.331c-1.18 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419zm7.974 0c-1.18 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                        </svg>
                      </button>

                      {/* Profile / open */}
                      <a href={modalUser.profileUrl || (modalUser.id || modalUser.userId ? `/users/${modalUser.id || modalUser.userId}` : '#')} target={modalUser.profileUrl || (modalUser.id || modalUser.userId) ? '_self' : undefined} rel={modalUser.profileUrl ? 'noopener noreferrer' : undefined} title={modalUser.profileUrl || modalUser.id || modalUser.userId ? 'Open profile' : 'No profile'} className={`p-2 rounded bg-gray-800 hover:bg-gray-700 ${modalUser.profileUrl || modalUser.id || modalUser.userId ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={(e) => { if (!(modalUser.profileUrl || modalUser.id || modalUser.userId)) e.preventDefault(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
