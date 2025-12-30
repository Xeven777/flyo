import type React from "react";
import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const font = Familjen_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flyo",
  description: "Create and share HTML snippets with live previews easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${font.className} antialiased`}>
        {children}
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
