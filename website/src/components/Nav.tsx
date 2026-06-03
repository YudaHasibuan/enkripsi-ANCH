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
    <nav className={`nav-pill ${scrolled ? "scrolled" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, padding: "0 24px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #7c5dfa, #00f0ff)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "0.95rem", color: "white", letterSpacing: -1,
            boxShadow: scrolled ? "0 0 15px rgba(0, 240, 255, 0.4)" : "0 0 15px rgba(124, 93, 250, 0.4)"
          }}>A</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--anch-text)", letterSpacing: "-0.02em" }}>
            ANCH <span style={{ color: scrolled ? "var(--anch-cyan)" : "var(--anch-purple-bright)", fontWeight: 600, fontSize: "0.78rem", letterSpacing: 0, marginLeft: 2 }}>v0.1.0</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="hidden-mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="hidden-mobile">
          <a href="https://github.com/YudaHasibuan/enkripsi-ANCH" target="_blank" rel="noopener" className="btn-secondary" style={{ padding: "8px 18px", fontSize: "0.82rem", borderRadius: 50 }}>
            <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            <span>GitHub</span>
          </a>
          <a href="#install" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.82rem", borderRadius: 50 }}>
            <span>pip install</span>
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
        <div style={{ borderTop: "1px solid rgba(124, 93, 250, 0.15)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12, background: "rgba(8, 6, 18, 0.95)", borderRadius: "0 0 24px 24px" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" onClick={() => setMenuOpen(false)} style={{ width: "100%", textAlign: "center" }}>{l.label}</a>
          ))}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
            <a href="https://github.com/YudaHasibuan/enkripsi-ANCH" target="_blank" rel="noopener" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.85rem" }}>
              GitHub
            </a>
            <a href="#install" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.85rem" }}>
              pip install
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
