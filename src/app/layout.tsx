import type { Metadata } from "next";
import { AppChrome } from "@/components/app-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stacked Deck",
  description: "A Riftbound card search app.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
