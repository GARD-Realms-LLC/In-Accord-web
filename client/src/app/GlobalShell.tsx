"use client";
import React from "react";
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import StoreProvider from "./redux";

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 w-full min-h-screen">
        <Sidebar />
        <main
          className="flex flex-col flex-1 h-full px-6 bg-gray-50 dark:bg-gray-900"
          style={{
            backgroundColor: '#f9fafb',
            marginLeft: 0,
            width: '100%',
            paddingTop: '68px', // Height of Navbar
            transition: 'padding-top 0.2s, margin-left 0.2s',
          }}
        >
          <Navbar />
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
