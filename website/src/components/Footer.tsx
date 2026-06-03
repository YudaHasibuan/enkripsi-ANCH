"use client";
import { AlertTriangle, ExternalLink } from "lucide-react";

export default function Footer() {
  const repoUrl = "https://github.com/YudaHasibuan/enkripsi-ANCH";

  return (
    <footer style={{ borderTop: "1px solid var(--anch-border)", padding: "52px 0 32px", background: "rgba(5,4,15,0.9)", position: "relative" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, #8b6dff, #00d4ff)",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: "0.9rem", color: "white",
              }}>A</div>
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>ANCH Framework</span>
            </div>
            <p style={{ color: "var(--anch-text-muted)", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 280 }}>
              An experimental adaptive hashing framework combining neural parameters and chaos theory.
              Open source, zero dependencies, pure Python.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <span className="badge badge-green" style={{ fontSize: "0.68rem", padding: "3px 10px" }}>MIT License</span>
              <span className="badge badge-purple" style={{ fontSize: "0.68rem", padding: "3px 10px" }}>Python 3.12+</span>
            </div>
          </div>

          {/* Framework */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--anch-text)" }}>Framework</div>
            {["Architecture", "Features", "Playground", "Benchmarks", "Install", "Roadmap"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", color: "var(--anch-text-muted)", fontSize: "0.85rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--anch-text)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--anch-text-muted)")}
              >{l}</a>
            ))}
          </div>

          {/* Modules */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--anch-text)" }}>Modules</div>
            {["feature.py", "neural.py", "chaos.py", "permutation.py", "compression.py", "benchmark.py"].map((m) => (
              <div key={m} style={{ display: "block", color: "var(--anch-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.78rem", marginBottom: 10 }}>{m}</div>
            ))}
          </div>

          {/* Links */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--anch-text)" }}>Links</div>
            {[
              { label: "PyPI Package", href: "https://pypi.org/project/anch-hash" },
              { label: "GitHub Repo", href: repoUrl },
              { label: "Documentation", href: "#" },
              { label: "Issues", href: `${repoUrl}/issues` },
              { label: "Changelog", href: `${repoUrl}/releases` },
            ].map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--anch-text-muted)", fontSize: "0.85rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--anch-text)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--anch-text-muted)")}
              >
                <span>{l.label}</span>
                <ExternalLink size={10} style={{ opacity: 0.6 }} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--anch-border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "var(--anch-text-muted)", fontSize: "0.8rem" }}>
            © 2026 ANCH Framework Team · MIT License
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--anch-orange)" }}>
            <AlertTriangle size={14} />
            <span style={{ fontSize: "0.8rem", color: "var(--anch-text-muted)" }}>
              Experimental — not for production cryptography
            </span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href={repoUrl} target="_blank" rel="noopener" style={{ color: "var(--anch-text-muted)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--anch-text)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--anch-text-muted)"}>GitHub</a>
            <a href="https://pypi.org/project/anch-hash" target="_blank" rel="noopener" style={{ color: "var(--anch-text-muted)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--anch-text)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--anch-text-muted)"}>PyPI</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
