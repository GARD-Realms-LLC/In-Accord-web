"use client";
import HomePageWrapper from "./HomePageWrapper";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <HomePageWrapper>{children}</HomePageWrapper>;
}
