import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DramaBos - Streaming Drakor & Film Sub Indo",
  description: "Nonton drama korea, film mandarin, dan short drama terbaru dengan subtitle Indonesia gratis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="hero-gradient">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="glass mt-20 border-t border-glass-border py-10">
          <div className="container text-center text-gray-400">
            <p className="mb-4">© 2026 DramaBos. All rights reserved.</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">DMCA</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
