import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const owners = localFont({
  src: "../public/assets/owners.ttf",
  variable: "--font-owners",
  display: "swap",
});

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
  title: "D'VINE 2.0",
  description: "D'VINE is a UI/UX hackathon for ideas that deserve to be felt.",
  icons: {
    icon: "/assets/dvine_favicon.ico",
    shortcut: "/assets/dvine_favicon.ico",
    apple: "/assets/dvine_favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${owners.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
