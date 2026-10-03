import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "D'VINE | From Vision to Creation",
  description: "D'VINE is a UI/UX hackathon for ideas that deserve to be felt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      {/*
        suppressHydrationWarning on <body> only: browser extensions (Grayscale,
        ad blockers, dark-mode toggles) inject data-* attributes onto <body>
        before React hydrates, which React reports as an attribute mismatch.
        Scoping it here silences that one known false positive without hiding
        real mismatches anywhere else in the tree.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
