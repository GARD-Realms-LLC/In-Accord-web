"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed, setSidebarWidth } from '@/state';
import { Archive, BotIcon, CircleDollarSignIcon, Clipboard, DrumstickIcon, FileQuestionIcon, GitCompareArrowsIcon, Layout, LucideIcon, Menu, PcCaseIcon, PlugIcon, ServerCogIcon, Settings, StarsIcon, User, Users2Icon, WebhookIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as Tooltip from '@radix-ui/react-tooltip';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const rootActivePaths = [
    "/home",
    "/plugins",
    "/themes",
    "/uploads",
    "/dashboard",
    "/inventory",
    "/products",
    "/profile",
    "/expenses",
    "/bots",
    "/servers",
    "/hosting",
    "/users",
    "/support",
    "/team",
    "/administrator",
  ];
  const isActive = pathname === href || (pathname === "/" && rootActivePaths.includes(href));

  return (
    <Link href={href}>
      <div className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md ${
        isCollapsed ? "justify-center py-3" : 'justify-start px-4 py-3'
      }
        hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white dark:bg-blue-600" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 text-black dark:text-gray-300" />

        <span className={`${
          isCollapsed ? "hidden" : "block"
          } font-medium text-base text-black dark:text-gray-300`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const SectionLabel = ({ text, isCollapsed }: { text: string; isCollapsed: boolean }) => (
  <span
    className={`${
      isCollapsed ? 'hidden' : 'block'
    } px-4 mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase`}
  >
    {text}
  </span>
);

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const sidebarWidth = useAppSelector((state) => state.global.sidebarWidth);

  const [currentUserRole, setCurrentUserRole] = React.useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const user = JSON.parse(raw);
        console.log('Sidebar: User loaded from localStorage:', user);
        console.log('Sidebar: User role:', user.role);
        setCurrentUserRole(user.role || null);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }

    const handleUserUpdate = () => {
      try {
        const raw = localStorage.getItem('currentUser');
        if (raw) {
          const user = JSON.parse(raw);
          console.log('Sidebar: User updated:', user);
          console.log('Sidebar: Updated role:', user.role);
          setCurrentUserRole(user.role || null);
          setIsLoggedIn(true);
        } else {
          setCurrentUserRole(null);
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    window.addEventListener('sessionCreated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
      window.removeEventListener('sessionCreated', handleUserUpdate);
    };
  }, []);

  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/your-server';
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/your-page';
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/your-company';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/your-repo';

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const isResizingRef = useRef(false);

  const collapsedWidth = 68;
  // Allow an even thinner minimum while keeping icons usable
  const minWidth = 70;
  const maxWidth = 320;
  // Default open width trimmed further for a slimmer sidebar
  const defaultOpenWidth = 80;

  const toggleSidebar = () => {
    if (isSidebarCollapsed) {
      // Reopen to a sensible default, ignoring the previous shrunken width
      dispatch(setSidebarWidth(Math.min(Math.max(defaultOpenWidth, minWidth), maxWidth)));
      dispatch(setIsSidebarCollapsed(false));
    } else {
      dispatch(setIsSidebarCollapsed(true));
    }
  }; 

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizingRef.current) return;
      const delta = event.clientX - startXRef.current;
      const nextWidth = Math.min(Math.max(startWidthRef.current + delta, minWidth), maxWidth);
      dispatch(setSidebarWidth(nextWidth));
    },
    [dispatch]
  );

  const handleMouseUp = useCallback(() => {
    if (!isResizingRef.current) return;
    isResizingRef.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isSidebarCollapsed) return;
    isResizingRef.current = true;
    startXRef.current = event.clientX;
    startWidthRef.current = sidebarWidth;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const normalized = Math.min(Math.max(sidebarWidth, minWidth), maxWidth);
    if (normalized !== sidebarWidth) {
      dispatch(setSidebarWidth(normalized));
    }
  }, [sidebarWidth, dispatch]);

  const clampedWidth = Math.min(Math.max(sidebarWidth, minWidth), maxWidth);
  const appliedWidth = isSidebarCollapsed ? collapsedWidth : clampedWidth;

  // Hide sidebar if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Keep the sidebar as a full-height column so the footer can sit at the bottom on tall viewports
  // Make sidebar relative so the resize handle is positioned correctly
  const sidebarClassNames = `relative flex flex-col h-screen bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden shadow-md z-40`;

  return (
    <Tooltip.Provider>
    <div 
      className={sidebarClassNames}
      style={{
        width: `${appliedWidth}px`,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827'
      }}
    >

    {/* TOP LOGO */}
    <div className={`flex justify-center items-center pt-4 pb-4 ${
      isSidebarCollapsed ? 'px-2' : 'px-4'
    }`}
    >
      <Link href="/home" aria-label="Go to home">
        <img 
          src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/splash.jpg" 
          alt="In-Accord" 
          className={`${isSidebarCollapsed ? 'w-10 h-10' : 'w-full'} object-contain`}
        />
      </Link>
    </div>

     {/* LINKS */}
      <hr />
    <div className='flex-1 mt-6 flex flex-col gap-1 overflow-y-auto'>
        <SidebarLink 
        href="/home"
        icon={Menu}
        label="Home" 
        isCollapsed={isSidebarCollapsed} 
      />
      <SectionLabel text="Download" isCollapsed={isSidebarCollapsed} />
        <SidebarLink 
        href="/plugins" 
        icon={PlugIcon}
        label="Plugins" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/themes" 
        icon={FileQuestionIcon}
        label="Themes" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/uploads" 
        icon={DrumstickIcon}
        label="Uploads" 
        isCollapsed={isSidebarCollapsed} 
      />
      <SectionLabel text="My Stuff" isCollapsed={isSidebarCollapsed} />
        <SidebarLink 
        href="/dashboard"
        icon={Layout}
        label="My Dashboard" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/inventory" 
        icon={Archive}
        label="My Downloads" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/products" 
        icon={Clipboard}
        label="My Products" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/profile" 
        icon={Settings}
        label="My Profile" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/expenses" 
        icon={CircleDollarSignIcon}
        label="My Contracts" 
        isCollapsed={isSidebarCollapsed} 
      />
    <SectionLabel text="Adverts" isCollapsed={isSidebarCollapsed} />
        <SidebarLink 
        href="/bots" 
        icon={BotIcon}
        label="Bots/Apps" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/servers" 
        icon={ServerCogIcon}
        label="Servers" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/hosting" 
        icon={PcCaseIcon}
        label="Hosting" 
        isCollapsed={isSidebarCollapsed}
      />
        <SidebarLink 
        href="/users" 
        icon={User}
        label="Ask a Dev" 
        isCollapsed={isSidebarCollapsed} 
      />
      <SectionLabel text="Contacts" isCollapsed={isSidebarCollapsed} />
        <SidebarLink 
        href="/support" 
        icon={WebhookIcon}
        label="Support" 
        isCollapsed={isSidebarCollapsed} 
      />
        <SidebarLink 
        href="/team" 
        icon={Users2Icon}
        label="Our Team" 
        isCollapsed={isSidebarCollapsed} 
      />
      </div>

      {/* Debug: Show current role */}
      {console.log('Sidebar: currentUserRole =', currentUserRole, 'Should show admin?', currentUserRole === 'Admin')}
      {currentUserRole === 'Admin' && (
        <div className="px-2 mb-4">
          <SidebarLink 
            href="/administrator" 
            icon={StarsIcon}
            label="Admin" 
            isCollapsed={isSidebarCollapsed} 
          />
          <hr className="mt-2 border-gray-300 dark:border-gray-600" />
        </div>
      )}

     {/* Bottom Section: Social icons and footer */}
      <div className="mt-auto mb-4 px-2">
        <div className={`flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center gap-2`}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link href={discordUrl} target="_blank" rel="noopener noreferrer" aria-label="Discord" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-[#5865F2]">
                  <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.19.335-.41.78-.563 1.137a18.27 18.27 0 0 0-4.01 0A8.84 8.84 0 0 0 11.422 3c-1.33.242-2.63.62-3.86 1.137C4.913 6.354 3.924 8.62 4.13 12.02c1.4 1.05 2.75 1.69 4.08 2.1.33-.46.62-.95.87-1.46-.48-.18-.94-.4-1.38-.66.12-.09.24-.18.36-.28 2.64 1.23 5.49 1.23 8.09 0 .12.1.24.19.36.28-.44.26-.9.48-1.38.66.25.51.54 1 .87 1.46 1.33-.41 2.68-1.05 4.08-2.1.33-5.22-.92-7.46-2.74-7.651ZM9.68 11.21c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.44-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Zm4.64 0c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.43-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Z" />
                </svg>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content className="rounded bg-gray-800 text-white px-2 py-1" sideOffset={4}>Discord</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-[#1877F2]">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content className="rounded bg-gray-800 text-white px-2 py-1" sideOffset={4}>Facebook</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-[#0A66C2]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content className="rounded bg-gray-800 text-white px-2 py-1" sideOffset={4}>LinkedIn</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-black dark:text-white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content className="rounded bg-gray-800 text-white px-2 py-1" sideOffset={4}>GitHub</Tooltip.Content>
          </Tooltip.Root>
        </div>
        {!isSidebarCollapsed && (
          <p className="mt-3 text-center text-xs text-red-500 dark:text-red-400">&copy; 2026 In-Accord | GARD Realms LLC</p>
        )}
      </div>
      <div
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-200 dark:hover:bg-gray-600"
        onMouseDown={handleMouseDown}
      />
   </div>
   </Tooltip.Provider>
  );
};

export default Sidebar;
