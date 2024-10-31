"use client"

import localFont from "next/font/local";
import "./globals.css";
import { Flowbite } from "flowbite-react";
import AppContextProvider from "@/context/AppContextProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppContextProvider>
          <Flowbite>
            {children}
          </Flowbite>
        </AppContextProvider>
      </body>
    </html>
  );
}
