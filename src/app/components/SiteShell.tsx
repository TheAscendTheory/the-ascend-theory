"use client";

import "./siteshell.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Media", href: "/media" },
  { label: "Resources", href: "/resources" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

export default function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActiveLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="globalNav" aria-label="Primary navigation">
        <Link href="/" className="brandLink" onClick={closeMenu}>
          <img src="/logo.PNG" alt="The Ascend Theory" />
          <span>The Ascend Theory</span>
        </Link>

        <div className="desktopNav">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={isActiveLink(link.href) ? "activeNavLink" : ""}
            >
              {link.label}
            </Link>
          ))}
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
          {navLinks.map((link) => (
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

      {children}
    </>
  );
}
