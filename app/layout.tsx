import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { BusinessesProvider } from "./_context/businesses-context";

const font = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
export const metadata: Metadata = {
  title: "Google Maps Scraper",
  description: "Scrape business data from Google Maps with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased h-screen bg-white`}>
        <Toaster position="bottom-right" />

        <BusinessesProvider>{children}</BusinessesProvider>
      </body>
    </html>
  );
}
