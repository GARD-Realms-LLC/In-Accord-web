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

  const normalizeRoute = React.useCallback((route: string | null | undefined) => {
    if (!route) return '/';
    const trimmed = route.trim();
    if (trimmed === '') return '/';
    const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const withoutTrailing = normalized.replace(/\/+$/, '');
    return withoutTrailing === '' ? '/' : withoutTrailing;
  }, []);

  const PROTECTED_ROUTE_PREFIXES = React.useMemo(
    () => [
      '/plugins',
      '/themes',
      '/ide',
      '/uploads',
      '/dashboard',
      '/inventory',
      '/products',
      '/profile',
      '/expenses',
      '/bots',
      '/servers',
      '/hosting',
      '/users',
      '/administrator',
    ],
    []
  );

  const routeRequiresAuth = React.useCallback(
    (targetPath: string | null | undefined) => {
      const normalizedTarget = normalizeRoute(targetPath);
      return PROTECTED_ROUTE_PREFIXES.some(
        (prefix) =>
          normalizedTarget === prefix || normalizedTarget.startsWith(`${prefix}/`)
      );
    },
    [PROTECTED_ROUTE_PREFIXES, normalizeRoute]
  );

  const hasRouteAccess = React.useCallback(
    (user: any, targetPath: string) => {
      const normalizedTarget = normalizeRoute(targetPath);
      const role = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : '';
      if (role === 'admin') return true;
      const allowed = Array.isArray(user?.allowedRoutes)
        ? user.allowedRoutes
            .map((route: any) => (typeof route === 'string' ? normalizeRoute(route) : null))
            .filter(Boolean) as string[]
        : [];
      if (allowed.includes('*')) return true;
      return allowed.some((allowedRoute) =>
        normalizedTarget === allowedRoute || normalizedTarget.startsWith(`${allowedRoute}/`)
      );
    },
    [normalizeRoute]
  );

  const enforceRouteGuards = React.useCallback(() => {
    const normalizedPath = normalizeRoute(pathname);
    if (!routeRequiresAuth(normalizedPath)) return;

    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      const user = raw ? JSON.parse(raw) : null;
      if (!user) {
        router.replace('/home');
        return;
      }
      if (!hasRouteAccess(user, normalizedPath)) {
        router.replace('/home');
      }
    } catch {
      router.replace('/home');
    }
  }, [hasRouteAccess, normalizeRoute, pathname, routeRequiresAuth, router]);

  // Redirect to home when accessing protected routes without permission
  useEffect(() => {
    enforceRouteGuards();
  }, [enforceRouteGuards]);

  // React to auth changes (login/logout) and re-evaluate guards
  useEffect(() => {
    const onAuthUpdate = () => {
      enforceRouteGuards();
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
  }, [enforceRouteGuards]);

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
        className={`flex flex-col flex-1 h-full px-6 bg-gray-50 dark:bg-gray-900`}
        style={{
          backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
          marginLeft: 0,
          width: '100%',
          paddingTop: '68px', // Height of Navbar (py-3 + px-4 + border/shadow)
          transition: 'padding-top 0.2s, margin-left 0.2s'
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