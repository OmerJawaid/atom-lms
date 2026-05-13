import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atom Adaptive Intelligence Hub",
  description: "AI-powered adaptive LMS for atomcamp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
