"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed} from '@/state';
import { Bell, Menu, Moon, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import LoginModal from './LoginModal';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  const Navbar = () => {
    const dispatch = useAppDispatch();
      const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
      );

  // Simple local auth state for UI (persisted to localStorage)
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; username?: string; avatar?: string } | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)); else localStorage.removeItem('currentUser');
      }
    } catch {}
  }, [currentUser]);

  const [showLoginModal, setShowLoginModal] = useState(false);

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
      try {
        const sres = await fetch(`${API_BASE}/api/admin/sessions/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user }) });
        const sjson = await sres.json().catch(() => ({}));
        if (sjson?.ok && sjson.session) {
          try { localStorage.setItem('sessionId', sjson.session.id); } catch {}
        }
      } catch (e) { console.warn('Failed to create session', e); }
      // notify other parts of the app that a session was created
      try { window.dispatchEvent(new CustomEvent('sessionCreated', { detail: { user, sessionId: typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null } })); } catch {}
      setCurrentUser({ name: user.name || name, username: user.username || name, email: user.email, avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || name)}` });
      return { ok: true, user };
    } catch (e) {
      console.error('Login error', e);
      return { ok: false, error: 'Network error' };
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
      <button 
        className="px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600" 
        onClick={toggleSidebar}
        >
         <Menu className="w-4 h-4 dark:text-gray-300" />
        </button>
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
            <img
              src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=DocRST'}
              alt="user"
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser?.name || 'DocRST'); }}
            />
            <span className="font-semibold">{currentUser?.name ?? 'DocRST'}</span>
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
                  setCurrentUser(null);
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
              >
                Logoff
              </button>
            )}
          </div>
          </div>
         </div> 
    );
  };
export default Navbar;
