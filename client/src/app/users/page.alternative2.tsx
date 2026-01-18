"use client";
import { useEffect, useMemo, useState } from "react";
import HomePageWrapper from "../HomePageWrapper";

type User = { id: string; name: string; email?: string; role?: string; lastLogin?: string };

export default function UsersAlternative2() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // detect prefers-color-scheme so component respects dark mode without Redux
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(Boolean(mq.matches));
      const handler = (ev: MediaQueryListEvent) => setIsDark(Boolean(ev.matches));
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler);
        else mq.removeListener(handler);
      };
    }
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const urls = [
        '/api/admin/users',
        (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') + '/api/admin/users',
      ];
      let resp: Response | null = null;
      for (const u of urls) {
        try {
          const r = await fetch(u, { credentials: 'include' });
          if (r && r.ok) { resp = r; break; }
        } catch {}
      }
      if (!resp) throw new Error('Failed to contact users API');
      const body = await resp.json();
      if (!body || !body.ok || !Array.isArray(body.users)) throw new Error('Invalid users response');
      const list: User[] = body.users.map((x: any, i: number) => ({
        id: String(x.id ?? x.userId ?? i),
        name: x.name ?? x.fullName ?? x.email ?? ('User ' + (i+1)),
        email: x.email ?? '',
        role: x.role ?? x.permission ?? 'user',
        lastLogin: x.lastLogin ?? x.last_seen ?? '',
      }));
      setUsers(list);
      setPage(1);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter(u => (u.name + ' ' + (u.email||'') + ' ' + (u.role||'')).toLowerCase().includes(q));
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page-1)*perPage, page*perPage);

  return (
    <HomePageWrapper>
      <div className="min-h-screen p-6">
        <div className={`max-w-5xl mx-auto rounded-lg p-4 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Users</h1>
              <p className="text-sm text-gray-500">Compact card grid  preserves navbar/sidebar and dark mode</p>
            </div>
            <div className="flex items-center gap-2">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, email, role" className="px-3 py-2 border rounded text-sm" />
              <button onClick={() => loadUsers()} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Refresh</button>
            </div>
          </div>

          {loading && <div className="py-6 text-center">Loading users...</div>}
          {error && <div className="py-4 text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visible.map(u => (
                  <div key={u.id} className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email || ''}</div>
                    <div className="text-xs mt-2">Role: <span className="font-medium">{u.role}</span></div>
                    {u.lastLogin && <div className="text-xs text-gray-400">Last login: {new Date(u.lastLogin).toLocaleString()}</div>}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">Showing {filtered.length === 0 ? 0 : ((page-1)*perPage+1)}{Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1} className="px-2 py-1 border rounded text-sm">Prev</button>
                  <div className="text-sm">{page} / {totalPages}</div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page>=totalPages} className="px-2 py-1 border rounded text-sm">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </HomePageWrapper>
  );
}
