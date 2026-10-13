import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";

// Inter: a widely-used, highly readable sans-serif for body text.
// Fraunces: serif display face for titles/headings, as requested.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "No White Walls",
  description: "Vintage and contemporary art.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-sans), sans-serif" }}>{children}</body>
    </html>
  );
}
