import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Architect | AI-Powered Event Design",
  description: "Design identity-aware event experiences with AI-powered networking, smart matchmaking, and seamless registration. Powered by Rhiz Protocol.",
  keywords: ["event management", "AI events", "networking", "matchmaking", "event design", "Rhiz Protocol"],
  authors: [{ name: "Rhiz" }],
  creator: "Rhiz",
  publisher: "Rhiz",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://eventarchitect.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Event Architect",
    title: "Event Architect | AI-Powered Event Design",
    description: "Design identity-aware event experiences with AI-powered networking, smart matchmaking, and seamless registration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Architect | AI-Powered Event Design",
    description: "Design identity-aware event experiences with AI-powered networking and smart matchmaking.",
    creator: "@RhizProtocol",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased tracking-tight`}
      >
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
