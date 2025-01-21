import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import DisableDraftMode from "@/components/DisableDraftMode";

const poppins = localFont({
  src: "../fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: "Mehwar",
  description: "Beauty Website Demo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={`${poppins.variable} antialiased`}>
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <Header />
          {children}
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#fff",
              },
            }}
          />
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
