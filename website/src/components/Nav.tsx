"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#pipeline", label: "Architecture" },
    { href: "#features", label: "Features" },
    { href: "#playground", label: "Playground" },
    { href: "#benchmarks", label: "Benchmarks" },
    { href: "#install", label: "Install" },
    { href: "#roadmap", label: "Roadmap" },
  ];

  return (
    <nav className="nav" style={{ boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #8b6dff, #00d4ff)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "0.95rem", color: "white", letterSpacing: -1,
          }}>A</div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--anch-text)" }}>
            ANCH <span style={{ color: "var(--anch-text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>v0.1.0</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden-mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="hidden-mobile">
          <a href="https://github.com/YudaHasibuan/enkripsi-ANCH" target="_blank" rel="noopener" className="btn-secondary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            GitHub
          </a>
          <a href="#install" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            pip install
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "var(--anch-text)", cursor: "pointer", fontSize: "1.4rem", display: "none" }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid var(--anch-border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="#install" className="btn-primary" style={{ width: "fit-content" }}>pip install</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
