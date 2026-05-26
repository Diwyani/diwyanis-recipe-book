import type { Metadata } from "next";
import { Barrio, Syne } from "next/font/google";
import "./globals.css";

// Google Fonts: Barrio (headings) + Syne (body)
const barrio = Barrio({
  variable: "--font-barrio",
  weight: "400",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Diwyani's Recipe Book",
  description: "A handmade-style recipe collection by Diwyani",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barrio.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-syne)]">
        {children}
      </body>
    </html>
  );
}
