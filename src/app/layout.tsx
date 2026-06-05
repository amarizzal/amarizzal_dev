import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rizal Ammar | Fullstack Developer Malang",
  description:
    "Rizal Ammar — Fullstack Developer berbasis di Malang. Spesialis Next.js, React, Node.js, dan pengembangan aplikasi web modern. Siap membantu bisnis Anda tumbuh dengan solusi digital yang handal dan scalable.",
  keywords: [
    "fullstack developer Malang",
    "web developer Malang",
    "jasa pembuatan website Malang",
    "jasa pembuatan aplikasi Malang",
    "freelance developer Malang",
    "Next.js developer Indonesia",
    "React developer Malang",
    "jasa website profesional Malang",
    "software developer Malang",
    "Rizal Ammar developer",
    "app developer Malang",
    "web app Malang",
  ],
  authors: [{ name: "Rizal Ammar", url: "https://amarizzal.dev" }],
  creator: "Rizal Ammar",
  publisher: "Rizal Ammar",
  metadataBase: new URL("https://amarizzal.dev"),
  alternates: {
    canonical: "https://amarizzal.dev",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://amarizzal.dev",
    siteName: "Rizal Ammar — Fullstack Developer",
    title: "Rizal Ammar | Fullstack Developer Malang",
    description:
      "Fullstack Developer berbasis di Malang. Membangun website dan aplikasi web modern yang cepat, scalable, dan profesional.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rizal Ammar — Fullstack Developer Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizal Ammar | Fullstack Developer Malang",
    description: "Fullstack Developer berbasis di Malang — Next.js, React, Node.js",
    images: ["/og-image.png"],
    creator: "@rizalammar",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rizal Ammar",
  jobTitle: "Fullstack Developer",
  description: "Fullstack Developer berbasis di Malang, Indonesia",
  url: "https://amarizzal.dev",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Malang",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
  knowsAbout: [
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "Web Development",
    "Mobile Development",
    "Database Design",
    "API Development",
  ],
  offers: {
    "@type": "Offer",
    description: "Jasa pembuatan website dan aplikasi web",
    areaServed: {
      "@type": "City",
      name: "Malang",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
