import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "./components/SiteShell";
import PremiumFooter from "./components/PremiumFooter";
import { Analytics } from "@vercel/analytics/next";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Ascend Theory",
  url: "https://theascendtheory.com",
  logo: "https://theascendtheory.com/logo.PNG",
  description:
    "A media, education, and community ecosystem built around financial literacy, market awareness, systems thinking, discipline, technology, youth education, and self-development.",
  sameAs: [
    "https://www.youtube.com/@TheAscendTheoryGlobal",
    "https://www.instagram.com/theascendtheoryglobal/",
    "https://x.com/AscendTheoryHQ",
    "https://www.linkedin.com/in/tapiwa-geza-70838a409/",
    "https://www.facebook.com/profile.php?id=61589229221663",
    "https://www.tiktok.com/@theascendtheoryglobal",
    "https://discord.gg/sRkBrb2n",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://theascendtheory.com"),

  title: {
    default: "The Ascend Theory | Systems. Markets. Mindset.",
    template: "%s | The Ascend Theory",
  },

  description:
    "A media, education, and community ecosystem built around financial literacy, market awareness, systems thinking, discipline, technology, youth education, and self-development.",

  keywords: [
    "The Ascend Theory",
    "financial literacy",
    "financial education",
    "youth education",
    "market awareness",
    "markets",
    "self development",
    "systems thinking",
    "education programs",
    "discipline",
    "technology",
    "AI literacy",
    "community learning",
  ],

  applicationName: "The Ascend Theory",

  authors: [{ name: "The Ascend Theory" }],

  creator: "The Ascend Theory",

  publisher: "The Ascend Theory",

  openGraph: {
    title: "The Ascend Theory",
    description:
      "Systems. Markets. Mindset. A media and education ecosystem for financial literacy, digital skills, market awareness, and personal development.",
    url: "https://theascendtheory.com",
    siteName: "The Ascend Theory",
    images: [
      {
        url: "/og-image.PNG",
        width: 1200,
        height: 630,
        alt: "The Ascend Theory brand preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "The Ascend Theory",
    description:
      "Systems. Markets. Mindset. A media and education ecosystem for ambitious builders, students, creators, and learners.",
    images: ["/og-image.PNG"],
  },

  icons: {
    icon: [
      {
        url: "/logo.PNG",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo.PNG",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        <SiteShell>
          {children}
          <PremiumFooter />
        </SiteShell>

        <Analytics />
      </body>
    </html>
  );
}
