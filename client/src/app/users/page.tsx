"use client";

import React from 'react';
import StoreProvider from '../redux';
import Navbar from '../(components)/Navbar';
import Sidebar from '../(components)/Sidebar';

export default function UsersPage(){
  return (
    <StoreProvider>
      <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <main className="flex-1 px-6 pt-20">
          <Navbar />

          <section className="max-w-4xl mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Users</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">This page intentionally shows a simple users placeholder to ensure Navbar and Sidebar render correctly.</p>

            <div className="mt-4 text-gray-700 dark:text-gray-200">If you expect live user data, reload the app after confirming the layout. I will not change other files.</div>
          </section>
        </main>
      </div>
    </StoreProvider>
  );
}



