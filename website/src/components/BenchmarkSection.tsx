"use client";

const benchData = [
  { size: "16 B",    anch: "2.1",  sha: "0.004", ratio: "525×" },
  { size: "64 B",    anch: "2.4",  sha: "0.005", ratio: "480×" },
  { size: "256 B",   anch: "3.1",  sha: "0.007", ratio: "443×" },
  { size: "1 KB",    anch: "5.8",  sha: "0.012", ratio: "483×" },
  { size: "4 KB",    anch: "18.2", sha: "0.035", ratio: "520×" },
  { size: "16 KB",   anch: "68.5", sha: "0.12",  ratio: "571×" },
  { size: "64 KB",   anch: "274",  sha: "0.46",  ratio: "596×" },
];

const metrics = [
  { label: "Avalanche Effect",     value: "~48.7%",  ideal: "~50%",  color: "var(--anch-green)",        icon: "💥", desc: "Mean bit-change on single-bit flip across 100 samples" },
  { label: "Digest Entropy",       value: "~4.2",    ideal: "8.0",   color: "var(--anch-purple-bright)", icon: "📊", desc: "Shannon entropy of output bytes (bits/byte)" },
  { label: "Collision Rate",       value: "0%",      ideal: "0%",    color: "var(--anch-cyan)",         icon: "💎", desc: "Zero collisions in 1,000 random-input test" },
  { label: "Throughput (64B)",     value: "~26 KB/s",ideal: "–",     color: "var(--anch-orange)",       icon: "⚡", desc: "Pure-Python baseline; C extension planned for v0.2" },
];

export default function BenchmarkSection() {
  return (
    <section id="benchmarks" className="section" style={{ background: "rgba(13,11,30,0.5)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-orange" style={{ marginBottom: 16, display: "inline-block" }}>📊 Benchmarks</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            Performance <span className="gradient-text-warm">Analysis</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 500, margin: "0 auto" }}>
            ANCH is an experimental framework — transparency about its trade-offs is part of the mission.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid-4" style={{ gap: 20, marginBottom: 48 }}>
          {metrics.map((m) => (
            <div key={m.label} className="feature-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>{m.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--anch-text-muted)", marginBottom: 10 }}>ideal: {m.ideal}</div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--anch-text-dim)" }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Runtime comparison table */}
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--anch-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Runtime vs SHA-256</h3>
              <p style={{ color: "var(--anch-text-muted)", fontSize: "0.82rem" }}>Pure Python 3.12 · Average of 10 runs per size · Windows 11</p>
            </div>
            <span className="badge badge-orange">⚠️ Experimental</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(26,24,54,0.8)" }}>
                  {["Input Size", "ANCH (ms)", "SHA-256 (ms)", "Speed Ratio", "Assessment"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: 600, color: "var(--anch-text-muted)", borderBottom: "1px solid var(--anch-border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {benchData.map((row, i) => (
                  <tr key={row.size} style={{ borderBottom: i < benchData.length - 1 ? "1px solid rgba(42,38,80,0.5)" : "none" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "rgba(139,109,255,0.04)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-cyan)" }}>{row.size}</td>
                    <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-orange)" }}>{row.anch}</td>
                    <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-green)" }}>{row.sha}</td>
                    <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-text-dim)" }}>{row.ratio} slower</td>
                    <td style={{ padding: "12px 20px", fontSize: "0.78rem", color: "var(--anch-text-muted)" }}>
                      {parseFloat(row.anch) < 10 ? "✅ Feasible for small payloads" : parseFloat(row.anch) < 100 ? "⚠️ Moderate cost" : "🔴 Large file overhead"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "16px 28px", borderTop: "1px solid var(--anch-border)", background: "rgba(26,24,54,0.4)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)" }}>
              💡 ANCH is <strong style={{ color: "var(--anch-orange)" }}>intentionally slower</strong> than SHA-256 — the chaotic pipeline prioritizes adaptability over raw throughput.
              A C extension and NumPy acceleration are planned for v0.2. Run <code style={{ fontFamily: "var(--font-mono)", color: "var(--anch-purple-bright)" }}>anch benchmark</code> to get numbers on your hardware.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
