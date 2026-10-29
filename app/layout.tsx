import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Recipe Match - Find Recipes That Match Your Mood",
  description:
    "Pick a mood and get an AI-written recipe with a photo, ingredients, steps, and a note on why it fits how you feel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${fraunces.variable} bg-[#f3eee6] font-sans text-stone-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
