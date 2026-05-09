import Link from "next/link";
import "./footer.css";

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

        <div className="footerColumn">
          <h4>Explore</h4>
          <Link href="/about">About</Link>
          <Link href="/media">Media</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/community">Community</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footerColumn">
          <h4>Connect</h4>
          <a href="mailto:contact@theascendtheory.com">
            contact@theascendtheory.com
          </a>
          <a href="#">YouTube</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>

      <div className="footerBottom">
        © 2026 The Ascend Theory. All rights reserved.
      </div>
    </footer>
  );
}