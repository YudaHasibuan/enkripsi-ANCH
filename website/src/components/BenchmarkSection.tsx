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

export default function BenchmarkSection() {
  return (
    <section id="benchmarks" className="section" style={{ background: "rgba(13,11,30,0.55)", position: "relative" }}>
      {/* Cyber Glow Backdrop */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(255,107,53,0.02) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-orange" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <BarChart3 size={12} />
            <span>Benchmarks</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Performance <span className="gradient-text-warm">Analysis</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 540, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            Transparency about mathematical trade-offs. ANCH trades raw microsecond speed for cryptographic adaptability.
          </p>
        </div>

        {/* Metric Cards with Circular SVG Dials */}
        <div className="grid-4" style={{ gap: 20, marginBottom: 54 }}>
          {/* Card 1: Avalanche */}
          <div className="feature-card" style={{ textAlign: "center", background: "rgba(22, 20, 48, 0.45)", borderColor: "rgba(42,38,80,0.6)", padding: "32px 24px" }}>
            <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
              <svg width="74" height="74" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--anch-green)" strokeDasharray="97, 100" strokeWidth="3.5" strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Zap size={18} style={{ color: "var(--anch-green)" }} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--anch-green)", lineHeight: 1, marginBottom: 4 }}>~48.7%</div>
            <div style={{ fontSize: "0.75rem", color: "var(--anch-text-muted)", marginBottom: 16 }}>ideal target: ~50%</div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 8, color: "white" }}>Avalanche Cascade</div>
            <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", lineHeight: 1.6 }}>Mean bit-flip ratio after mutating a single input bit across 100 samples.</div>
          </div>

          {/* Card 2: Entropy */}
          <div className="feature-card" style={{ textAlign: "center", background: "rgba(22, 20, 48, 0.45)", borderColor: "rgba(42,38,80,0.6)", padding: "32px 24px" }}>
            <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
              <svg width="74" height="74" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--anch-purple-bright)" strokeDasharray="53, 100" strokeWidth="3.5" strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <BarChart3 size={18} style={{ color: "var(--anch-purple-bright)" }} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--anch-purple-bright)", lineHeight: 1, marginBottom: 4 }}>~4.25</div>
            <div style={{ fontSize: "0.75rem", color: "var(--anch-text-muted)", marginBottom: 16 }}>ideal limit: 8.00</div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 8, color: "white" }}>Digest Entropy</div>
            <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", lineHeight: 1.6 }}>Shannon byte-level entropy scale. High entropy ensures resistance to correlation attacks.</div>
          </div>

          {/* Card 3: Collision Rate */}
          <div className="feature-card" style={{ textAlign: "center", background: "rgba(22, 20, 48, 0.45)", borderColor: "rgba(42,38,80,0.6)", padding: "32px 24px" }}>
            <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
              <svg width="74" height="74" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--anch-cyan)" strokeDasharray="100, 100" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Layers size={18} style={{ color: "var(--anch-cyan)" }} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--anch-cyan)", lineHeight: 1, marginBottom: 4 }}>0.00%</div>
            <div style={{ fontSize: "0.75rem", color: "var(--anch-text-muted)", marginBottom: 16 }}>target ceiling: 0%</div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 8, color: "white" }}>Collision Rate</div>
            <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", lineHeight: 1.6 }}>Zero collisions observed in a standard 10,000 random-input collision test.</div>
          </div>

          {/* Card 4: Throughput */}
          <div className="feature-card" style={{ textAlign: "center", background: "rgba(22, 20, 48, 0.45)", borderColor: "rgba(42,38,80,0.6)", padding: "32px 24px" }}>
            <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
              <svg width="74" height="74" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--anch-orange)" strokeDasharray="30, 100" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Timer size={18} style={{ color: "var(--anch-orange)" }} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--anch-orange)", lineHeight: 1, marginBottom: 4 }}>~26 KB/s</div>
            <div style={{ fontSize: "0.75rem", color: "var(--anch-text-muted)", marginBottom: 16 }}>pure Python stdlib</div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 8, color: "white" }}>Throughput (64B)</div>
            <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", lineHeight: 1.6 }}>Tested on Intel i7. A compiled C-extension planned for v0.2 will boost speed 100x.</div>
          </div>
        </div>

        {/* Runtime comparison block (Side by Side) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 36 }} className="bench-layout">
          
          {/* Left Column: Detailed table */}
          <div className="glass" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(124, 93, 250, 0.2)" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(124, 93, 250, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4, color: "white" }}>Speed Cost vs SHA-256</h3>
                <p style={{ color: "var(--anch-text-muted)", fontSize: "0.8rem", fontWeight: 500 }}>Average of 10 runs per input size on Python 3.12</p>
              </div>
              <span className="badge badge-orange" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px" }}>
                <AlertTriangle size={11} />
                <span>Experimental</span>
              </span>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 450 }}>
                <thead>
                  <tr style={{ background: "rgba(6, 4, 15, 0.6)" }}>
                    {["Input Size", "ANCH (ms)", "SHA-256 (ms)", "Overhead"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "var(--anch-text-dim)", borderBottom: "1px solid rgba(124, 93, 250, 0.15)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {benchData.map((row, i) => {
                    const isSlow = parseFloat(row.anch) >= 100;
                    const isMedium = parseFloat(row.anch) >= 10 && parseFloat(row.anch) < 100;
                    return (
                      <tr 
                        key={row.size} 
                        style={{ borderBottom: i < benchData.length - 1 ? "1px solid rgba(124, 93, 250, 0.1)" : "none", transition: "background 0.2s" }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(124, 93, 250, 0.04)")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-cyan)", fontWeight: 600 }}>{row.size}</td>
                        <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-orange)", fontWeight: 600 }}>{row.anch} ms</td>
                        <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--anch-green)", fontWeight: 600 }}>{row.sha} ms</td>
                        <td style={{ padding: "14px 20px" }}>
                          {isSlow ? (
                            <span className="badge badge-orange" style={{ fontSize: "0.68rem", padding: "3px 8px" }}>Heavy overhead</span>
                          ) : isMedium ? (
                            <span className="badge badge-purple" style={{ fontSize: "0.68rem", padding: "3px 8px" }}>Moderate cost</span>
                          ) : (
                            <span className="badge badge-green" style={{ fontSize: "0.68rem", padding: "3px 8px" }}>Feasible cost</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Visual Explanation & Bar chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Visual Overhead chart representation */}
            <div className="glass" style={{ borderRadius: 20, padding: 28, background: "rgba(18, 16, 42, 0.4)", border: "1px solid rgba(124, 93, 250, 0.15)" }}>
              <h4 style={{ fontWeight: 800, fontSize: "1.05rem", color: "white", marginBottom: 18 }}>The Mathematical Overhead</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "SHA-256 (Optimized C Block)", val: 1.5, color: "var(--anch-green)", text: "Fast static rounds, fixed permutation pathways" },
                  { label: "ANCH (Pseudo-Neural generation)", val: 40, color: "var(--anch-cyan)", text: "Dynamic parameter calculation per message" },
                  { label: "ANCH (Chaotic simulation rounds)", val: 100, color: "var(--anch-orange)", text: "Iterative logistic map state execution" }
                ].map((bar) => (
                  <div key={bar.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 600 }}>
                      <span style={{ color: "var(--anch-text-dim)" }}>{bar.label}</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.02)" }}>
                      <div style={{ width: `${bar.val}%`, height: "100%", background: bar.color, borderRadius: 10 }} />
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "var(--anch-text-muted)" }}>{bar.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning / Informational Callout */}
            <div style={{ padding: 22, background: "rgba(255,107,53,0.03)", border: "1px solid rgba(255,107,53,0.15)", borderRadius: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Info size={16} style={{ color: "var(--anch-orange)", flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", lineHeight: 1.6 }}>
                <strong style={{ color: "white" }}>Why is it slower?</strong> ANCH is designed to resist ASIC hashing hardware acceleration by dynamically constructing unique encryption schedules per input. This intentional complexity makes it excellent for dataset fingerprinting or payloads verification, but not suited for proof-of-work mining.
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .bench-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
