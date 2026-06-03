import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ANCH — Adaptive Neural Chaotic Hash Framework",
  description:
    "An experimental adaptive hashing framework combining Feature Extraction, Neural Parameter Generation, Chaos Theory, Dynamic Permutation, and a Compression Engine.",
  keywords: [
    "hashing",
    "cryptography",
    "chaos theory",
    "neural",
    "adaptive",
    "hash",
    "Python",
    "experimental",
    "fingerprinting",
  ],
  authors: [{ name: "ANCH Framework Team" }],
  openGraph: {
    title: "ANCH Framework",
    description: "Adaptive Neural Chaotic Hash — experimental Python hashing framework",
    url: "https://anch-framework.vercel.app",
    siteName: "ANCH Framework",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
