"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed} from '@/state';
import { Bell, Menu, Moon, Settings, Sun, User } from 'lucide-react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import { useRouter } from 'next/navigation';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  const Navbar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
      const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
      );

  // Simple local auth state for UI (persisted to localStorage)
  const [currentUser, setCurrentUser] = useState<{ id?: string; userId?: string; name?: string; email?: string; username?: string; role?: string; avatar?: string } | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Listen for localStorage changes (e.g., when profile is updated)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const raw = localStorage.getItem('currentUser');
        const updated = raw ? JSON.parse(raw) : null;
        setCurrentUser(updated);
      } catch {}
    };

    // Listen for storage events (from other tabs) and custom events (from same tab)
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)); else localStorage.removeItem('currentUser');
      }
    } catch {}
  }, [currentUser]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const avatarUrl = currentUser?.avatar || (currentUser as any)?.avatarUrl || 'https://ui-avatars.com/api/?name=Not+Logged+In';
  const isGeneratedAvatar = typeof avatarUrl === 'string' && avatarUrl.includes('ui-avatars.com');

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  useEffect(() => {
    try {
      // Debugging: log current avatar state to help diagnose why navbar shows fallback
      // Remove these logs once the issue is resolved.
      // eslint-disable-next-line no-console
      console.log('Navbar avatar debug:', { avatarUrl, isGeneratedAvatar, avatarError, currentUser });
    } catch (e) {}
  }, [avatarUrl, isGeneratedAvatar, avatarError, currentUser]);

  async function handleLogin(username: string, password: string) {
    const name = (username || '').trim();
    if (!name) return { ok: false, error: 'Username required' } as const;
    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: name, password }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return { ok: false, error: j.error || 'Login failed' };
      }
      const j = await res.json();
      const user = j.user || { name: name, username: name };
      console.log('Login response user:', user);
      console.log('User role from backend:', user.role);
      
      try {
        const sres = await fetch(`${API_BASE}/api/admin/sessions/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user }) });
        const sjson = await sres.json().catch(() => ({}));
        if (sjson?.ok && sjson.session) {
          try { localStorage.setItem('sessionId', sjson.session.id); } catch {}
        }
      } catch (e) { console.warn('Failed to create session', e); }
      
      const fullUser = { 
        id: user.id || user.userId, 
        userId: user.id || user.userId, 
        name: user.name || name, 
        username: user.username || name, 
        email: user.email, 
        role: user.role || 'User', 
        avatar: user.avatar || user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || name)}` 
      };
      
      console.log('Setting currentUser:', fullUser);
      setCurrentUser(fullUser);
      
      // Save to localStorage immediately and notify
      try {
        localStorage.setItem('currentUser', JSON.stringify(fullUser));
        console.log('Saved to localStorage:', fullUser);
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      
      // notify other parts of the app that a session was created
      try { 
        window.dispatchEvent(new CustomEvent('sessionCreated', { detail: { user: fullUser, sessionId: typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null } })); 
        window.dispatchEvent(new Event('userUpdated'));
      } catch {}
      
      return { ok: true, user: fullUser };
    } catch (e) {
      console.error('Login error', e);
      // If backend is not reachable, provide a helpful error message
      const errorMsg = e instanceof TypeError && e.message.includes('fetch') 
        ? 'Backend server not reachable. Please make sure the server is running on ' + API_BASE 
        : 'Network error';
      return { ok: false, error: errorMsg };
    }
  }

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const toggleSidebar = () => {
      dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };
    
    const toggleDarkMode = () => {
      console.log('Dark mode toggle clicked. Current isDarkMode state:', isDarkMode);
      const newState = !isDarkMode;
      console.log('Dispatching new state:', newState);
      dispatch(setIsDarkMode(newState));
    };

    return (
      <>
        <div 
          className="flex justify-between items-center w-full mb-7 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#111827'
          }}
        >
         
          {/*left side */} 
          <div className="flex justify-between items-center gap-5">
            <div className="hidden md:flex justify-between items-center gap-5">
            </div>  
            {currentUser && (
              <button 
                className="px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600" 
                onClick={toggleSidebar}
              >
                <Menu className="w-4 h-4 dark:text-gray-300" />
              </button>
            )}
          </div>
          
          <div className='relative'>
            <input 
              type="search" 
              placeholder="Start typing  to search" 
              className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-blue-500"
            />
            <div className='absolute inset-y-0 left-0 pl- flex items-center pointer-events-none'>
              <Bell className="text-gray-500 dark:text-gray-400" size={20} />
            </div>
          </div> 

          {/*Right Side */}
          <div className="flex justify-between items-center gap-5">
            <div className="hidden md:flex justify-between items-center gap-5">
            </div>  
            <button 
              onClick={toggleDarkMode}
              className="px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 z-50"
              type="button"
            >
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500 dark:text-yellow-400" size={24} />
              ): (
                <Moon className="cursor-pointer text-gray-500 dark:text-gray-300" size={24} />
              )}
            </button>
            <div className="relative">
              <Bell className="cursor-pointer text-gray-500" size={24} />
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center 
              px-[0.4rem] py-1 text-xs leading-none text-red-100 bg-red-600 rounded-full">
                3
              </span>
            </div>
            <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
            <div className="flex items-center gap-3">
              {!avatarError && !isGeneratedAvatar ? (
                <img
                  src={avatarUrl}
                  alt={currentUser?.name ?? 'user'}
                  className="w-9 h-9 rounded-full object-cover bg-gray-200"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="text-gray-600" size={18} />
                </div>
              )}
              <span className="font-semibold">{currentUser?.name ?? 'Not Logged In'}</span>
            </div>
            <div className="flex items-center gap-2">
              {!currentUser && (
                <>
                  <button onClick={() => setShowLoginModal(true)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Login</button>
                  <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onSubmit={handleLogin} />
                </>
              )}
              {currentUser && (
                <button
                  onClick={async () => {
                    try {
                      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
                      if (sessionId) {
                        await fetch(`${API_BASE}/api/admin/sessions/terminate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) }).catch(() => null);
                        try { localStorage.removeItem('sessionId'); } catch {}
                      }
                      await fetch(`${API_BASE}/api/admin/auth/logout`, { method: 'POST' }).catch(() => null);
                    } catch (e) { console.warn('Logout error', e); }
                    // Clear user immediately and notify listeners
                    try { localStorage.removeItem('currentUser'); } catch {}
                    setCurrentUser(null);
                    setShowLogoutToast(true);
                    try {
                      // Emit dedicated logout and general update events
                      window.dispatchEvent(new Event('logout'));
                      window.dispatchEvent(new Event('userUpdated'));
                    } catch {}
                    // Auto-dismiss toast after 3 seconds
                    setTimeout(() => setShowLogoutToast(false), 3000);
                    // Prefer a hard navigation to ensure protected pages unload
                    try { router.replace('/home'); } catch {}
                    // Fallback in case router navigation is blocked
                    try { setTimeout(() => { window.location.assign('/home'); }, 50); } catch {}
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                >
                  Logoff
                </button>
              )}
            </div>
          </div>
        </div>
        
        {showLogoutToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Logged out successfully</span>
          </div>
        )}
      </>
    );
  };
export default Navbar;
