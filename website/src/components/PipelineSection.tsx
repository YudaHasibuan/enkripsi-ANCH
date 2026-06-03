"use client";
import { 
  Database, 
  Binary, 
  BrainCircuit, 
  Activity, 
  Shuffle, 
  Minimize2, 
  Lock,
  ArrowDown
} from "lucide-react";

const stages = [
  { id: "input",       label: "Input Data",              icon: Database,     desc: "String, bytes, or file path",                     color: "var(--anch-text-dim)" },
  { id: "feature",     label: "Feature Extractor",        icon: Binary,       desc: "Bit count · Entropy · Byte frequency · Bigrams",  color: "var(--anch-cyan)" },
  { id: "neural",      label: "Neural Parameter Gen",     icon: BrainCircuit, desc: "Seed · r-value · Rotations · Compression key",   color: "var(--anch-purple-bright)" },
  { id: "chaos",       label: "Chaotic Engine",           icon: Activity,     desc: "Logistic map → chaos byte stream",               color: "var(--anch-orange)" },
  { id: "permutation", label: "Dynamic Permutation",      icon: Shuffle,      desc: "Bit shuffle · Word rotation · Diffusion",        color: "var(--anch-green)" },
  { id: "compression", label: "Compression Engine",       icon: Minimize2,    desc: "Feistel rounds · State folding",                 color: "var(--anch-cyan)" },
  { id: "digest",      label: "ANCH Digest (256-bit)",    icon: Lock,         desc: "64-character hex · Constant-time verify",        color: "var(--anch-purple-bright)" },
];

export default function PipelineSection() {
  return (
    <section id="pipeline" className="section" style={{ position: "relative", overflow: "hidden" }}>
      {/* Visual connection grid overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(139,109,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(139,109,255,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-block", padding: "5px 14px" }}>⚙️ Architecture</span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            The <span className="gradient-text">ANCH Pipeline</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 540, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Five distinct stages transform raw input into a unique, reproducible 256-bit digest.
            Each stage feeds into the next, with chaos bytes controlling every decision.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }} className="pipeline-grid">
          {/* Left: pipeline flow */}
          <div style={{ position: "sticky", top: 100 }} className="pipeline-flow">
            {stages.map((stage, i) => {
              const IconComp = stage.icon;
              return (
                <div key={stage.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div 
                    className="pipeline-node" 
                    style={{ 
                      borderColor: i === 6 ? "var(--anch-purple)" : "rgba(42,38,80,0.6)",
                      background: "rgba(22, 20, 48, 0.4)",
                      width: "100%",
                      padding: "16px 20px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ 
                        width: 32, height: 32, 
                        borderRadius: 8, 
                        background: "rgba(255,255,255,0.03)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}>
                        <IconComp size={16} style={{ color: stage.color }} />
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--anch-text)", fontSize: "0.9rem" }}>{stage.label}</span>
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="pipeline-arrow" style={{ margin: "8px 0", color: "var(--anch-border)" }}>
                      <ArrowDown size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: detail cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stages.slice(1).map((stage) => {
              const IconComp = stage.icon;
              return (
                <div 
                  key={stage.id} 
                  className="feature-card"
                  style={{
                    background: "rgba(22, 20, 48, 0.45)",
                    borderColor: "rgba(42,38,80,0.6)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ 
                      width: 44, height: 44, 
                      borderRadius: 10, 
                      background: "rgba(255,255,255,0.03)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}>
                      <IconComp size={20} style={{ color: stage.color }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--anch-text)", fontSize: "1.05rem", marginBottom: 2 }}>{stage.label}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)" }}>{stage.desc}</div>
                    </div>
                  </div>
                  
                  {stage.id === "feature" && (
                    <div className="code-block" style={{ fontSize: "0.78rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
                      <span className="cm"># feature.py extracts 134-float vector</span>{"\n"}
                      feats = <span className="fn">extract_features</span>(data){"\n"}
                      vec   = <span className="fn">build_feature_vector</span>(feats)
                    </div>
                  )}
                  {stage.id === "neural" && (
                    <div className="code-block" style={{ fontSize: "0.78rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
                      <span className="cm"># neural.py — two dense layers, LCG weights</span>{"\n"}
                      params = <span className="fn">generate_parameters</span>(vec){"\n"}
                      <span className="cm"># → seed, r_value, rotations, compression_key</span>
                    </div>
                  )}
                  {stage.id === "chaos" && (
                    <div className="code-block" style={{ fontSize: "0.78rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
                      <span className="cm"># chaos.py — logistic map x[n+1] = r·x·(1-x)</span>{"\n"}
                      chaos_b = <span className="fn">generate_chaos_state</span>(params, <span className="nm">128</span>)
                    </div>
                  )}
                  {stage.id === "permutation" && (
                    <div className="code-block" style={{ fontSize: "0.78rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
                      <span className="cm"># permutation.py — Fisher-Yates bit shuffle</span>{"\n"}
                      state = <span className="fn">apply_permutation</span>(state, params, chaos_b)
                    </div>
                  )}
                  {stage.id === "compression" && (
                    <div className="code-block" style={{ fontSize: "0.78rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
                      <span className="cm"># compression.py — 4–16 Feistel rounds</span>{"\n"}
                      state = <span className="fn">compress</span>(state, params, chaos_b)
                    </div>
                  )}
                  {stage.id === "digest" && (
                    <div className="code-block" style={{ fontSize: "0.78rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
                      <span className="cm"># Fold 64→32 bytes, finalize, hex-encode</span>{"\n"}
                      digest = <span className="fn">finalize_digest</span>(state, data){"\n"}
                      <span className="cm"># → &quot;7f91ac3b2d058e4f...&quot; (64 chars)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pipeline-grid {
            grid-template-columns: 1fr !important;
          }
          .pipeline-flow {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 32px;
          }
        }
      `}</style>
    </section>
  );
}
