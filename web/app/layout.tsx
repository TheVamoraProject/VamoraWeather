import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vamora Weather",
  description: "Weather forecasts powered by Vamora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
