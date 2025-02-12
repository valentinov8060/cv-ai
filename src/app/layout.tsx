import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cvaibuilder.vercel.app"), // Pastikan ini adalah URL produksi Anda
  title: "CV AI Builder - Create Your AI-Powered Resume",
  description:
    "Generate professional resumes effortlessly with CV AI Builder. ATS-friendly, customizable, and downloadable in PDF format.",
  keywords: "CV AI, resume builder, AI resume, ATS-friendly CV, online CV generator",
  openGraph: {
    type: "website",
    url: "https://cvaibuilder.vercel.app/",
    title: "CV AI Builder - Create Your AI-Powered Resume",
    description:
      "Generate professional resumes effortlessly with CV AI Builder. ATS-friendly, customizable, and downloadable in PDF format.",
    images: [
      {
        url: "/logo.svg", // URL relatif akan diselesaikan dengan metadataBase
        width: 1200,
        height: 630,
        alt: "CV AI Builder - AI-powered CV generator",
      },
    ],
  },
  alternates: {
    canonical: "https://cvaibuilder.vercel.app/",
  },
  robots: {
    index: true, // Izinkan Google mengindeks halaman
    follow: true, // Izinkan Google mengikuti link di halaman
  },
  authors: [{ name: "Bill Valentinov", url: "https://cvaibuilder.vercel.app/" }],
  publisher: "Valentinov Software",
  twitter: {
    card: "summary_large_image",
    title: "CV AI Builder - Create Your AI-Powered Resume",
    description:
      "Generate professional resumes effortlessly with CV AI Builder. ATS-friendly, customizable, and downloadable in PDF format.",
    images: ["/logo.svg"],
  },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cvaibuilder.vercel.app/" />
        <link rel="icon" href="logo.svg" type="image/x-icon" />
      </head>
      <body>
        {children}
        {/* JSON-LD untuk Rich Results Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CV AI Builder",
              url: "https://cvaibuilder.vercel.app",
              logo: "https://cvaibuilder.vercel.app/logo.svg",
              description: "Generate professional resumes effortlessly with AI. ATS-friendly, customizable, and downloadable in PDF format.",
              image: "https://cvaibuilder.vercel.app/logo.svg",
              contactPoint: {
                "@type": "ContactPoint",
                email: "valentinovbill0@gmail.com",
                contactType: "customer support",
              },
            }),
          }}
        />
      </body>
    </html>
  );
};

export default Layout;
