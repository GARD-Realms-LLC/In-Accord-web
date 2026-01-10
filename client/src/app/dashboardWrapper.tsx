"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const sidebarWidth = useAppSelector((state) => state.global.sidebarWidth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    console.log('Dark mode changed to:', isDarkMode, 'HTML classes:', html.classList.value);
  }, [isDarkMode]);

  const minWidth = 120;
  const maxWidth = 320;
  const clampedSidebarWidth = Math.min(Math.max(sidebarWidth, minWidth), maxWidth);
  const appliedSidebarOffset = isSidebarCollapsed ? 64 : clampedSidebarWidth;

  // Centralized list of routes that require authentication
  const protectedRoutes = [
    '/administrator',
    '/dashboard',
    '/profile',
    '/inventory',
    '/products',
    '/expenses',
    '/bots',
    '/servers',
    '/hosting',
    '/users'
  ];

  // Redirect to home when accessing protected routes without a logged-in user
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      const user = raw ? JSON.parse(raw) : null;
      const isProtected = protectedRoutes.some((p) => pathname?.startsWith(p));
      if (isProtected && !user) {
        // Use replace to avoid back button returning to protected page
        router.replace('/home');
      }
      // Enforce Admin-only access for administrator route
      if (pathname?.startsWith('/administrator') && user && user.role !== 'Admin') {
        router.replace('/home');
      }
    } catch (e) {
      // Fail-safe: if parsing fails, redirect off protected routes
      const isProtected = protectedRoutes.some((p) => pathname?.startsWith(p));
      if (isProtected) router.replace('/home');
    }
  }, [pathname, router]);

  // React to auth changes (login/logout) and re-evaluate guards
  useEffect(() => {
    const onAuthUpdate = () => {
      try {
        const raw = localStorage.getItem('currentUser');
        const user = raw ? JSON.parse(raw) : null;
        const isProtected = protectedRoutes.some((p) => pathname?.startsWith(p));
        if (isProtected && !user) router.replace('/home');
        // Enforce Admin-only access for administrator route
        if (pathname?.startsWith('/administrator') && user && user.role !== 'Admin') {
          router.replace('/home');
        }
      } catch {}
    };
    window.addEventListener('userUpdated', onAuthUpdate);
    window.addEventListener('storage', onAuthUpdate);
    window.addEventListener('sessionCreated', onAuthUpdate);
    window.addEventListener('logout', onAuthUpdate);
    return () => {
      window.removeEventListener('userUpdated', onAuthUpdate);
      window.removeEventListener('storage', onAuthUpdate);
      window.removeEventListener('sessionCreated', onAuthUpdate);
      window.removeEventListener('logout', onAuthUpdate);
    };
  }, [pathname, router]);

  return (
    <div
      className="flex bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 w-full min-h-screen"
      style={{
        backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
        color: isDarkMode ? '#f3f4f6' : '#111827'
      }}
    >
      <Sidebar />
      <main
        className={`flex flex-col flex-1 h-full py-7 px-6 bg-gray-50 dark:bg-gray-900`}
        style={{
          backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
          marginLeft: 0,
          width: '100%'
        }}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;