"use client";

import { useState, useEffect } from 'react';

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

  // Clear error when modal is closed
  useEffect(() => {
    if (!show) setError(null);
    else {
      // Only check server status when modal opens
      let cancelled = false;
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      fetch(apiBase + '/api/health', { method: 'GET' })
        .then(() => {
          if (!cancelled) setError(null);
        })
        .catch(() => {
          if (!cancelled) setError('Network error: server offline');
        });
      return () => { cancelled = true; };
    }
  }, [show]);

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
        {/* Server offline message above logo */}
        {error && /not reachable|offline|network/i.test(error) && (
          <div className="text-center font-bold text-red-700 mb-2">Server is offline</div>
        )}
        {/* Logo at the top */}
        <div className="flex justify-center mb-4">
          <img 
            src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/splash.jpg" 
            alt="In-Accord" 
            className="w-40 h-40 object-contain"
          />
        </div>
        
        <h3 className="text-lg font-semibold mb-3 text-center">Login</h3>
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
        {error && <div className="text-sm text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">{error}</div>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Cancel</button>
          <button onClick={() => void submit()} disabled={loading} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}
