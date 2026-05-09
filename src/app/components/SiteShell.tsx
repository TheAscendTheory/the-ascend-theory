"use client";

import "./siteshell.css";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Media", "/media"],
    ["Resources", "/resources"],
    ["Community", "/community"],
    ["Contact", "/contact"],
  ];

  return (
    <>
      <nav className="globalNav">
        <Link href="/" className="brandLink">
          <img src="/logo.png" alt="The Ascend Theory" />
          <span>The Ascend Theory</span>
        </Link>

        <div className="desktopNav">
          {navLinks.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </div>

        <button
          className="menuButton"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobileNav">
          {navLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {children}
    </>
  );
}