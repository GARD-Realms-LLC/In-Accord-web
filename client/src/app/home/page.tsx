"use client";
import React, { useState, useEffect } from "react";

const Home = (props: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto w-full px-6">
        <header className="w-full flex justify-center items-center py-8">
        <h1
          className="font-extrabold text-indigo-700 dark:text-indigo-400 text-center"
          style={{ fontSize: '8rem', lineHeight: '1', margin: 0 }}
        >
          In-Accord
        </h1>
        <div style={{ height: '1.5em' }}></div>
      </header>
        <section className="w-full py-8">
        <h2 className="max-w-4xl text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mx-auto">
          The Premier Discord customization and management suite.
        </h2>
        <p className="mt-4 mb-4 w-full max-w-3xl mx-auto text-center text-base text-gray-600 dark:text-gray-300">
          In-Accord empowers community leaders and server owners with advanced Discord management tools, customizable themes, plugin support, and seamless integrations. Built for reliability, security, and ease of use, it’s the all-in-one solution for growing and managing vibrant online communities.
        </p>
      </section>
        <main className="flex flex-1 flex-col items-center pb-0 min-h-0">
        <div className="flex flex-1 flex-col items-center justify-center gap-6">

          <section className="flex justify-center items-center w-full">
            <ResizableImage />
          </section>
        </div>
      </main>
      </div>
    </div>
  );
};

// ResizableImage component for user-controlled image width with persistence
function ResizableImage() {
  const localStorageKey = "homeImageSize";
  const defaultWidth = 512; // previously max, now default
  const maxWidth = 1024;    // double the previous max
  const minWidth = 64;

  const [width, setWidth] = useState(defaultWidth);

  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      const savedWidth = Number(saved);
      // Clamp to new max/min
      setWidth(Math.max(minWidth, Math.min(savedWidth, maxWidth)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(width));
  }, [width]);

  function handleResize() {
    const input = prompt(`Enter new width (px, ${minWidth}-${maxWidth}):`, String(width));
    if (!input) {
      alert("Resize cancelled or no value entered.");
      return;
    }
    const newWidth = Math.max(minWidth, Math.min(Number(input), maxWidth));
    if (isNaN(newWidth)) {
      alert("Invalid value. Please enter a number.");
      return;
    }
    setWidth(newWidth);
  }

  return (
    <div className="relative flex flex-col items-center" style={{ width: `${width}px` }}>
      <img
        src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/In-Accord%20working.png"
        alt="In-Accord application preview"
        style={{ width: "100%", height: "auto" }}
        className="rounded-1xl border border-gray-200 bg-white shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
      />
      <button
        type="button"
        aria-label="Resize Image"
        onClick={e => { e.preventDefault(); handleResize(); }}
        className="absolute bottom-4 right-4 flex items-center justify-center bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700"
        style={{ zIndex: 10, width: '32px', height: '32px', padding: 0 }}
      >
        {/* Left-right arrow <-> SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
          <polyline points="12 5 5 12 12 19" />
        </svg>
      </button>
    </div>
  );
}
export default Home

