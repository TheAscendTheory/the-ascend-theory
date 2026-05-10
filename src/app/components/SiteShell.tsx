"use client";

import "./siteshell.css";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import AIAssistantDock from "./AIAssistantDock";
import { MediaLayerProvider } from "./MediaLayer";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Charts", href: "/resources/market-dashboard" },
  { label: "Economic Calendar", href: "/resources/economic-calendar" },
  { label: "Academy", href: "/learn" },
  { label: "News", href: "/news" },
  { label: "Social", href: "/social" },
];

const moreLinks = [
  { label: "Resources", href: "/resources" },
  { label: "Risk Calculator", href: "/resources/risk-calculator" },
  { label: "Demo Trading", href: "/resources/demo-trading" },
  { label: "Trade Journal", href: "/resources/trade-journal" },
  { label: "Affiliates", href: "/affiliates" },
  { label: "Programs", href: "/programs" },
  { label: "Community", href: "/community" },
  { label: "Media", href: "/media" },
  { label: "About", href: "/about" },
  { label: "Account", href: "/account" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

const mobileGroups = [
  { title: "Main", links: primaryLinks },
  { title: "Explore", links: moreLinks },
];

export default function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
    setMoreOpen(false);
  }

  function isActiveLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/resources") {
      return pathname === "/resources";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <MediaLayerProvider>
      <nav className="globalNav" aria-label="Primary navigation">
        <Link href="/" className="brandLink" onClick={closeMenu}>
          <Image
            src="/logo.PNG"
            alt="The Ascend Theory"
            width={3543}
            height={3135}
            priority
          />
          <span>The Ascend Theory</span>
        </Link>

        <div className="desktopNav">
          {primaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={isActiveLink(link.href) ? "activeNavLink" : ""}
            >
              {link.label}
            </Link>
          ))}

          <div className="moreNavWrap">
            <button
              type="button"
              className={moreLinks.some((link) => isActiveLink(link.href)) ? "activeNavLink" : ""}
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-controls="more-navigation"
            >
              More <ChevronDown size={15} />
            </button>

            {moreOpen && (
              <div id="more-navigation" className="moreNavPanel">
                {moreLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={isActiveLink(link.href) ? "activeNavLink" : ""}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="menuButton"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="mobileNav">
          {mobileGroups.map((group) => (
            <div key={group.title} className="mobileNavGroup">
              <p>{group.title}</p>
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={isActiveLink(link.href) ? "activeNavLink" : ""}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      {children}
      <AIAssistantDock />
      </MediaLayerProvider>
    </>
  );
}
