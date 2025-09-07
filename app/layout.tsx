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
  title: "Google Maps Data Extractor",
  description: "Extract business emails and websites from Google Maps listings.",
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
