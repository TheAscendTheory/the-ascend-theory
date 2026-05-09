import "./globals.css";
import SiteShell from "./components/SiteShell";
import PremiumFooter from "./components/PremiumFooter";

export const metadata = {
  title: "The Ascend Theory",
  description: "Systems. Markets. Mindset.",
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