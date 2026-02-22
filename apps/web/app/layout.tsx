import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeamCore",
  description: "Modern football team management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground min-h-screen flex flex-col`}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-black/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-8 w-8 rounded-md bg-black dark:bg-white" aria-hidden />
                <Link href="/" className="text-sm font-semibold tracking-tight">
                  TeamCore
                </Link>
              </div>

              {user && (
                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <a href="/dashboard" className="hover:opacity-70 transition-opacity">Dashboard</a>
                  <a href="/players" className="hover:opacity-70 transition-opacity">Players</a>
                  <a href="/teams" className="hover:opacity-70 transition-opacity">Teams</a>
                </nav>
              )}

              <div className="flex items-center gap-2">
                {user ? (
                  <UserMenu email={user.email!} />
                ) : (
                  <a
                    href="/auth/login"
                    className="inline-flex h-9 items-center rounded-md bg-black px-3 text-xs font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    Sign in
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <p className="opacity-70">© {new Date().getFullYear()} TeamCore. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</a>
                <a href="/terms" className="hover:opacity-70 transition-opacity">Terms</a>
                <a href="/contact" className="hover:opacity-70 transition-opacity">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
