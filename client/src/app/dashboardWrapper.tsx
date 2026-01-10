"use client";

import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Socket.IO client instance (singleton per component instance)
  let socket: Socket | null = null;
  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000");
    }
    const handleLiveUpdate = (data: any) => {
      // You can replace this with a toast/notification or state update
      console.log("Live update received:", data);
      // Example: show a browser notification (optional)
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Live Update", { body: data.message });
      }
    };
    socket.on("liveUpdate", handleLiveUpdate);
    // Request notification permission if not already granted
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    return () => {
      socket?.off("liveUpdate", handleLiveUpdate);
    };
  }, []);
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