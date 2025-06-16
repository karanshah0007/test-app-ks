import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import "./lib/amplify";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Management System",
  description: "Upload and manage your files",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 container-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
