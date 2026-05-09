import "./globals.css";
import SiteShell from "./components/SiteShell";
import PremiumFooter from "./components/PremiumFooter";

export const metadata = {
  title: "The Ascend Theory | Systems. Markets. Mindset.",
  description:
    "A media and education ecosystem built around financial literacy, systems thinking, markets, discipline, technology, and self-development.",
  keywords: [
    "The Ascend Theory",
    "financial literacy",
    "media ecosystem",
    "self development",
    "markets",
    "discipline",
    "education",
    "systems thinking",
  ],
  openGraph: {
    title: "The Ascend Theory",
    description:
      "Systems. Markets. Mindset. A media and education ecosystem for ambitious builders.",
    url: "https://theascendtheory.com",
    siteName: "The Ascend Theory",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The Ascend Theory",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ascend Theory",
    description:
      "Systems. Markets. Mindset. A media and education ecosystem for ambitious builders.",
    images: ["/logo.png"],
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
      </body>
    </html>
  );
}