"use client";
import { useEffect, useState } from "react";
import HomePageWrapper from "../HomePageWrapper";

const Users = (props: Props) => {
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {

        // Try relative path first, then fallback to localhost backend
        const candidates = [
          '/api/admin/users',
          (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') + '/api/admin/users',
        ];
        let resp = null;
        for (const url of candidates) {
          try {
            resp = await fetch(url, { credentials: 'include' });
            if (resp && resp.ok) break;
          } catch (e) {
            
            // continue to next
          }
        }
        if (!resp) throw new Error('Failed to fetch users');
        const body = await resp.json();
        if (!body || !body.ok || !Array.isArray(body.users)) {
          throw new Error('Invalid users response');
        }
        const list = body.users.map((u: any) => (u.name || u.fullName || u.email || u.id || u.userId || 'Unnamed'));
        if (mounted) setUsers(list);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchUsers();
    return () => { mounted = false; };
  }, []);

  return (
    <HomePageWrapper>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">

          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 m-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Users</h2>

            {loading && <p className="text-sm text-gray-600 dark:text-gray-300">Loading users...</p>}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {!loading && !error && (
              <ul className="space-y-2">
                {users.length === 0 && <li className="text-gray-600 dark:text-gray-400">No users found.</li>}
                {users.map((u) => (
                  <li key={u} className="rounded-md p-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                    {u}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </HomePageWrapper>
  );
}

export default Users
