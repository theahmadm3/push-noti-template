import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Push Notification Template",
  description: "A Next.js PWA with push notification support",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Push Notification Template",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
