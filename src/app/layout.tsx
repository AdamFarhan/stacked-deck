import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppChrome } from "@/components/app-chrome";
import "./globals.css";

const beaufort = localFont({
  src: "../../public/fonts/BeaufortForLoL/BeaufortforLOL-Bold.otf",
  variable: "--font-beaufort",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Stacked Deck",
  description: "A Riftbound card search app.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={beaufort.variable}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
