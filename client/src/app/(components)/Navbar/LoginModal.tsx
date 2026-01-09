"use client";

import { useState } from 'react';

type LoginResult = { ok?: boolean; error?: string; user?: any };

export default function LoginModal({
  show,
  onClose,
  onSubmit,
  initialUsername,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (username: string, password: string) => Promise<LoginResult>;
  initialUsername?: string;
}) {
  if (!show) return null;
  const [username, setUsername] = useState(initialUsername || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    setLoading(true);
    try {
      const r = await onSubmit(username.trim(), password);
      if (r && r.ok) {
        setPassword('');
        onClose();
      } else {
        setError(r?.error || 'Login failed');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Login</h3>
        <label className="text-sm block mb-1">Username</label>
        <input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit();
          }}
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-sm mb-2"
        />
        <label className="text-sm block mb-1">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit();
          }}
          type="password"
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-sm mb-2"
        />
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Cancel</button>
          <button onClick={() => void submit()} disabled={loading} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
      </div>
    </div>
  );
}
