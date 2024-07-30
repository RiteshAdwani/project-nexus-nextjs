import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Nexus",
  description: "A platform to share your creative projects",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${inter.className} h-screen bg-gradient-to-r from-purple-50 to-indigo-100`}
        >
          {session && <Navbar />}
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
