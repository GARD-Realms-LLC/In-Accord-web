"use client";

import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	let socket: Socket | null = null;
	useEffect(() => {
		if (!socket) {
			socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000");
		}
		const handleLiveUpdate = (data: any) => {
			console.log("Live update received:", data);
			if (window.Notification && Notification.permission === "granted") {
				new Notification("Live Update", { body: data.message });
			}
		};
		socket.on("liveUpdate", handleLiveUpdate);
		if (window.Notification && Notification.permission !== "granted") {
			Notification.requestPermission();
		}
		return () => {
			socket?.off("liveUpdate", handleLiveUpdate);
		};
	}, []);
	const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
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
		const withoutTrailing = normalized.replace(/\/+\0$/, '');
		return withoutTrailing === '' ? '/' : withoutTrailing;
	}, []);

	// Replace debug bar with an empty fragment for testing
	return (
		<>
			<div className="flex bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 w-full min-h-screen">
				<Sidebar />
				<main
					className="flex flex-col flex-1 h-full px-6 bg-gray-50 dark:bg-gray-900"
					style={{
						marginLeft: 0,
						width: '100%',
						paddingTop: '68px',
						transition: 'padding-top 0.2s, margin-left 0.2s'
					}}
				>
					<Navbar />
					{children}
				</main>
			</div>
		</>
	);
};

const HomePageWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<StoreProvider>
				<HomeLayout>
					{children}
				</HomeLayout>
			</StoreProvider>
		</>
	);
};

export default HomePageWrapper;

