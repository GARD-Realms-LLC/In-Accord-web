"use client";
import { useEffect, useState } from "react";
import HomePageWrapper from "../HomePageWrapper";

type UserRecord = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

export default function UsersAlternative() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  async function fetchUsers() {
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
      if (!resp) throw new Error('no response from API');
      const body = await resp.json();
      if (!body || !body.ok || !Array.isArray(body.users)) throw new Error('invalid response');
      const list: UserRecord[] = body.users.map((x: any, i: number) => ({
        id: String(x.id ?? x.userId ?? i),
        name: x.name ?? x.fullName ?? x.email ?? ('User ' + (i+1)),
        email: x.email ?? '',
        role: x.role ?? x.permission ?? 'user',
      }));
      setUsers(list);
      setLastUpdated(Date.now());
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  return (
    <HomePageWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Users (Alternative view)</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => fetchUsers()} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Refresh</button>
              <button onClick={() => { setUsers([]); setError(null); }} className="px-3 py-1 rounded border text-sm">Clear</button>
            </div>
          </div>

          {loading && <div className="text-sm text-gray-500">Loading</div>}
          {error && (
            <div className="mb-3 text-sm text-red-600">Error: {error} <button onClick={() => fetchUsers()} className="ml-2 underline">Retry</button></div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="text-sm text-gray-500">No users yet  <button onClick={() => fetchUsers()} className="underline">Try loading</button></div>
          )}

          {!loading && users.length > 0 && (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2 text-gray-600">{u.email || ''}</td>
                    <td className="py-2 text-gray-600">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 text-xs text-gray-500">{lastUpdated ? 'Last updated: ' + new Date(lastUpdated).toLocaleString() : ''}</div>
        </div>
      </div>
    </HomePageWrapper>
  );
}
