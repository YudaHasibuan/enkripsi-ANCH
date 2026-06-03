"use client";
import { useState } from "react";
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
  const [activeStage, setActiveStage] = useState<string>("feature");

  return (
    <section id="pipeline" className="section" style={{ position: "relative", overflow: "hidden" }}>
      {/* Cyber Grid Overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(124,93,250,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(124,93,250,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <BrainCircuit size={12} />
            <span>Architecture</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            The <span className="gradient-text">ANCH Pipeline</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 580, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            Seven modular stages transform raw input into a secure, reproducible 256-bit digest. Hover on any node to dissect the engine.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.1fr", gap: 48, alignItems: "start" }} className="pipeline-grid">
          {/* Left Column: Interactive flow list */}
          <div style={{ position: "sticky", top: 120 }} className="pipeline-flow">
            {stages.map((stage, i) => {
              const IconComp = stage.icon;
              const isActive = activeStage === stage.id;
              return (
                <div key={stage.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div 
                    className={`pipeline-node ${isActive ? "active-node" : ""}`}
                    onMouseEnter={() => setActiveStage(stage.id)}
                    style={{ 
                      borderColor: isActive ? stage.color : "rgba(124,93,250,0.15)",
                      background: isActive ? "rgba(124,93,250,0.08)" : "rgba(21,19,45,0.35)",
                      width: "100%",
                      padding: "16px 20px",
                      boxShadow: isActive ? `0 0 20px rgba(0, 240, 255, 0.15)` : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ 
                          width: 32, height: 32, 
                          borderRadius: 8, 
                          background: isActive ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          border: isActive ? `1px solid ${stage.color}` : "1px solid rgba(255,255,255,0.04)"
                        }}>
                          <IconComp size={16} style={{ color: isActive ? stage.color : "var(--anch-text-dim)" }} />
                        </div>
                        <span style={{ fontWeight: 700, color: isActive ? "white" : "var(--anch-text-dim)", fontSize: "0.92rem", transition: "color 0.2s" }}>{stage.label}</span>
                      </div>
                      
                      {isActive && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: stage.color, boxShadow: `0 0 10px ${stage.color}` }} />
                      )}
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="pipeline-arrow" style={{ margin: "6px 0", color: isActive ? stage.color : "rgba(124,93,250,0.2)", transition: "color 0.3s" }}>
                      <ArrowDown size={15} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic detail cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="pipeline-details">
            {stages.map((stage) => {
              const IconComp = stage.icon;
              const isActive = activeStage === stage.id;
              return (
                <div 
                  key={stage.id} 
                  className="feature-card"
                  onMouseEnter={() => setActiveStage(stage.id)}
                  style={{
                    background: "rgba(21, 19, 45, 0.45)",
                    borderColor: isActive ? stage.color : "rgba(124, 93, 250, 0.15)",
                    opacity: isActive ? 1 : 0.38,
                    transform: isActive ? "scale(1.015)" : "scale(1.0)",
                    boxShadow: isActive ? `0 15px 40px rgba(0,0,0,0.5), 0 0 30px ${stage.color}15` : "0 10px 30px rgba(0,0,0,0.2)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ 
                      width: 44, height: 44, 
                      borderRadius: 10, 
                      background: isActive ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      border: isActive ? `1px solid ${stage.color}` : "1px solid rgba(255,255,255,0.03)"
                    }}>
                      <IconComp size={20} style={{ color: stage.color }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "white", fontSize: "1.1rem", marginBottom: 2 }}>{stage.label}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--anch-text-dim)", fontWeight: 500 }}>{stage.desc}</div>
                    </div>
                  </div>
                  
                  {stage.id === "input" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                      <span className="cm"># Accept strings, raw bytes, or file paths</span>{"\n"}
                      data = <span className="st">b&quot;hello world&quot;</span>
                    </div>
                  )}
                  {stage.id === "feature" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                      <span className="cm"># feature.py extracts 134-float feature vector</span>{"\n"}
                      feats = <span className="fn">extract_features</span>(data){"\n"}
                      vec   = <span className="fn">build_feature_vector</span>(feats)
                    </div>
                  )}
                  {stage.id === "neural" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                      <span className="cm"># neural.py — two dense layers, LCG weights</span>{"\n"}
                      params = <span className="fn">generate_parameters</span>(vec){"\n"}
                      <span className="cm"># → seed, r_value, rotations, compression_key</span>
                    </div>
                  )}
                  {stage.id === "chaos" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                      <span className="cm"># chaos.py — logistic map x[n+1] = r·x·(1-x)</span>{"\n"}
                      chaos_b = <span className="fn">generate_chaos_state</span>(params, <span className="nm">128</span>)
                    </div>
                  )}
                  {stage.id === "permutation" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                      <span className="cm"># permutation.py — Fisher-Yates bit shuffle</span>{"\n"}
                      state = <span className="fn">apply_permutation</span>(state, params, chaos_b)
                    </div>
                  )}
                  {stage.id === "compression" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                      <span className="cm"># compression.py — 4–16 Feistel rounds</span>{"\n"}
                      state = <span className="fn">compress</span>(state, params, chaos_b)
                    </div>
                  )}
                  {stage.id === "digest" && (
                    <div className="code-block" style={{ fontSize: "0.82rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
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
        @media (max-width: 850px) {
          .pipeline-grid {
            grid-template-columns: 1fr !important;
          }
          .pipeline-flow {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 24px;
          }
          .pipeline-details {
            gap: 12px !important;
          }
          .pipeline-details > div {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
