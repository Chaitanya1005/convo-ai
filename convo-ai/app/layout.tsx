import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convo-AI | Rupeezy RM Workspace",
  description: "AI-powered lead processing system for Rupeezy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
