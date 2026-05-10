import Link from "next/link";
import "./footer.css";

const exploreLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Media", href: "/media" },
  { label: "Resources", href: "/resources" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

const contactLinks = [
  { label: "General", href: "mailto:contact@theascendtheory.com" },
  { label: "Media", href: "mailto:media@theascendtheory.com" },
  { label: "Support", href: "mailto:support@theascendtheory.com" },
  { label: "Founder", href: "mailto:founder@theascendtheory.com" },
];

const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@TheAscendTheoryGlobal",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/theascendtheoryglobal/",
  },
  {
    label: "X",
    href: "https://x.com/AscendTheoryHQ",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tapiwa-geza-70838a409/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589229221663",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@theascendtheoryglobal",
  },
  {
    label: "Discord",
    href: "https://discord.gg/sRkBrb2n",
  },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function PremiumFooter() {
  return (
    <footer className="premiumFooter">
      <div className="footerGrid">
        <div className="footerBrand">
          <h3>The Ascend Theory</h3>
          <p>
            A media and education ecosystem built around systems, markets,
            mindset, discipline, technology, and financial literacy.
          </p>
        </div>

        <nav className="footerColumn" aria-label="Footer navigation">
          <h4>Explore</h4>
          {exploreLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footerColumn">
          <h4>Contact</h4>
          {contactLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="footerColumn">
          <h4>Social</h4>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}

          <h4 className="footerLegalTitle">Legal</h4>
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="footerBottom">
        © 2026 The Ascend Theory. All rights reserved.
      </div>
    </footer>
  );
}
