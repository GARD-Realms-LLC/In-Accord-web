import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "In-Accord",
  description: "The Premier Discord Customis and Control APP.",
};

// Inline script to set dark mode class before hydration
function setInitialDarkMode() {
  const code = `
    try {
      const ls = window.localStorage.getItem('darkMode');
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (ls === 'true' || (ls === null && system)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{setInitialDarkMode()}</head>
      <body suppressHydrationWarning className={inter.className}>
        {children}
      </body>
    </html>
  );
}
