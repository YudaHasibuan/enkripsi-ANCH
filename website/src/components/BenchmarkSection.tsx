"use client";
import { 
  Zap, 
  BarChart3, 
  Layers, 
  Timer, 
  AlertTriangle,
  Info
} from "lucide-react";

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
  { label: "Avalanche Effect",     value: "~48.7%",  ideal: "~50%",  color: "var(--anch-green)",        icon: Zap, desc: "Mean bit-change on single-bit flip across 100 samples" },
  { label: "Digest Entropy",       value: "~4.2",    ideal: "8.0",   color: "var(--anch-purple-bright)", icon: BarChart3, desc: "Shannon entropy of output bytes (bits/byte)" },
  { label: "Collision Rate",       value: "0%",      ideal: "0%",    color: "var(--anch-cyan)",         icon: Layers, desc: "Zero collisions in 1,000 random-input test" },
  { label: "Throughput (64B)",     value: "~26 KB/s",ideal: "–",     color: "var(--anch-orange)",       icon: Timer, desc: "Pure-Python baseline; C extension planned for v0.2" },
];

export default function BenchmarkSection() {
  return (
    <section id="benchmarks" className="section" style={{ background: "rgba(13,11,30,0.55)", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-orange" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <BarChart3 size={12} />
            <span>Benchmarks</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Performance <span className="gradient-text-warm">Analysis</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 500, margin: "0 auto", fontSize: "1.05rem" }}>
            ANCH is an experimental framework — transparency about its trade-offs is part of the mission.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid-4" style={{ gap: 20, marginBottom: 48 }}>
          {metrics.map((m) => {
            const MetricIcon = m.icon;
            return (
              <div 
                key={m.label} 
                className="feature-card" 
                style={{ 
                  textAlign: "center",
                  background: "rgba(22, 20, 48, 0.45)",
                  borderColor: "rgba(42,38,80,0.6)"
                }}
              >
                <div style={{ 
                  width: 52, height: 52, 
                  borderRadius: "50%", 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <MetricIcon size={22} style={{ color: m.color }} />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--anch-text-muted)", marginBottom: 14 }}>ideal: {m.ideal}</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 6, color: "var(--anch-text)" }}>{m.label}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--anch-text-dim)", lineHeight: 1.5 }}>{m.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Runtime comparison table */}
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden", background: "rgba(18, 16, 42, 0.55)", borderColor: "rgba(42,38,80,0.8)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(42,38,80,0.6)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 4, color: "var(--anch-text)" }}>Runtime vs SHA-256</h3>
              <p style={{ color: "var(--anch-text-muted)", fontSize: "0.82rem" }}>Pure Python 3.12 · Average of 10 runs per size · Windows 11</p>
            </div>
            <span className="badge badge-orange" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <AlertTriangle size={10} />
              <span>Experimental</span>
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "rgba(26,24,54,0.6)" }}>
                  {["Input Size", "ANCH (ms)", "SHA-256 (ms)", "Speed Ratio", "Assessment"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "var(--anch-text-dim)", borderBottom: "1px solid rgba(42,38,80,0.6)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {benchData.map((row, i) => {
                  const isSlow = parseFloat(row.anch) >= 100;
                  const isMedium = parseFloat(row.anch) >= 10 && parseFloat(row.anch) < 100;
                  return (
                    <tr key={row.size} style={{ borderBottom: i < benchData.length - 1 ? "1px solid rgba(42,38,80,0.4)" : "none", transition: "background 0.2s" }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "rgba(139,109,255,0.03)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-cyan)" }}>{row.size}</td>
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-orange)" }}>{row.anch}</td>
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-green)" }}>{row.sha}</td>
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-text-dim)" }}>{row.ratio} slower</td>
                      <td style={{ padding: "14px 20px" }}>
                        {isSlow ? (
                          <span className="badge badge-orange" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Large file overhead</span>
                        ) : isMedium ? (
                          <span className="badge badge-purple" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Moderate cost</span>
                        ) : (
                          <span className="badge badge-green" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Feasible for small payloads</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "18px 28px", borderTop: "1px solid rgba(42,38,80,0.6)", background: "rgba(26,24,54,0.2)", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Info size={14} style={{ color: "var(--anch-purple)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)", lineHeight: 1.5, margin: 0 }}>
              ANCH is <strong style={{ color: "var(--anch-orange)" }}>intentionally slower</strong> than SHA-256 — the chaotic pipeline prioritizes adaptability over raw throughput.
              A C extension and NumPy acceleration are planned for v0.2. Run <code style={{ fontFamily: "var(--font-mono)", color: "var(--anch-purple-bright)" }}>anch benchmark</code> to get numbers on your hardware.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
