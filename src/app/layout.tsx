import "./globals.css";
import SiteShell from "./components/SiteShell";
import PremiumFooter from "./components/PremiumFooter";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "The Ascend Theory | Systems. Markets. Mindset.",
  description:
    "A media and education ecosystem built around financial literacy, systems thinking, markets, discipline, technology, and self-development.",

  keywords: [
    "The Ascend Theory",
    "financial literacy",
    "markets",
    "self development",
    "systems thinking",
    "education",
    "discipline",
    "technology",
  ],

  openGraph: {
    title: "The Ascend Theory",
    description:
      "Systems. Markets. Mindset. A media and education ecosystem for ambitious builders.",
    url: "https://theascendtheory.com",
    siteName: "The Ascend Theory",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Ascend Theory",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "The Ascend Theory",
    description:
      "Systems. Markets. Mindset. A media and education ecosystem for ambitious builders.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteShell>
          {children}
          <PremiumFooter />
        </SiteShell>

        <Analytics />
      </body>
    </html>
  );
}