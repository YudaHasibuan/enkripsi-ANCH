"use client";

const stages = [
  { id: "input",       label: "Input Data",              icon: "📥", desc: "String, bytes, or file path",                     color: "var(--anch-text-dim)" },
  { id: "feature",     label: "Feature Extractor",        icon: "🔬", desc: "Bit count · Entropy · Byte frequency · Bigrams",  color: "var(--anch-cyan)" },
  { id: "neural",      label: "Neural Parameter Gen",     icon: "🧠", desc: "Seed · r-value · Rotations · Compression key",   color: "var(--anch-purple-bright)" },
  { id: "chaos",       label: "Chaotic Engine",           icon: "🌀", desc: "Logistic map → chaos byte stream",               color: "var(--anch-orange)" },
  { id: "permutation", label: "Dynamic Permutation",      icon: "🔀", desc: "Bit shuffle · Word rotation · Diffusion",        color: "var(--anch-green)" },
  { id: "compression", label: "Compression Engine",       icon: "🗜️", desc: "Feistel rounds · State folding",                 color: "var(--anch-cyan)" },
  { id: "digest",      label: "ANCH Digest (256-bit)",    icon: "🔐", desc: "64-character hex · Constant-time verify",        color: "var(--anch-purple-bright)" },
];

export default function PipelineSection() {
  return (
    <section id="pipeline" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-block" }}>⚙️ Architecture</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            The <span className="gradient-text">ANCH Pipeline</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Five distinct stages transform raw input into a unique, reproducible 256-bit digest.
            Each stage feeds into the next, with chaos bytes controlling every decision.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }}>
          {/* Left: pipeline flow */}
          <div style={{ position: "sticky", top: 100 }}>
            {stages.map((stage, i) => (
              <div key={stage.id}>
                <div className="pipeline-node" style={{ borderColor: i === 6 ? "var(--anch-purple)" : undefined }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.2rem" }}>{stage.icon}</span>
                    <span style={{ fontWeight: 600, color: stage.color, fontSize: "0.9rem" }}>{stage.label}</span>
                  </div>
                </div>
                {i < stages.length - 1 && <div className="pipeline-arrow">↓</div>}
              </div>
            ))}
          </div>

          {/* Right: detail cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stages.slice(1).map((stage) => (
              <div key={stage.id} className="feature-card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: "1.6rem" }}>{stage.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: stage.color, marginBottom: 2 }}>{stage.label}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)" }}>{stage.desc}</div>
                  </div>
                </div>
                {stage.id === "feature" && (
                  <div className="code-block" style={{ fontSize: "0.78rem" }}>
                    <span className="cm"># feature.py extracts 134-float vector</span>{"\n"}
                    feats = <span className="fn">extract_features</span>(data){"\n"}
                    vec   = <span className="fn">build_feature_vector</span>(feats)
                  </div>
                )}
                {stage.id === "neural" && (
                  <div className="code-block" style={{ fontSize: "0.78rem" }}>
                    <span className="cm"># neural.py — two dense layers, LCG weights</span>{"\n"}
                    params = <span className="fn">generate_parameters</span>(vec){"\n"}
                    <span className="cm"># → seed, r_value, rotations, compression_key</span>
                  </div>
                )}
                {stage.id === "chaos" && (
                  <div className="code-block" style={{ fontSize: "0.78rem" }}>
                    <span className="cm"># chaos.py — logistic map x[n+1] = r·x·(1-x)</span>{"\n"}
                    chaos_b = <span className="fn">generate_chaos_state</span>(params, <span className="nm">128</span>)
                  </div>
                )}
                {stage.id === "permutation" && (
                  <div className="code-block" style={{ fontSize: "0.78rem" }}>
                    <span className="cm"># permutation.py — Fisher-Yates bit shuffle</span>{"\n"}
                    state = <span className="fn">apply_permutation</span>(state, params, chaos_b)
                  </div>
                )}
                {stage.id === "compression" && (
                  <div className="code-block" style={{ fontSize: "0.78rem" }}>
                    <span className="cm"># compression.py — 4–16 Feistel rounds</span>{"\n"}
                    state = <span className="fn">compress</span>(state, params, chaos_b)
                  </div>
                )}
                {stage.id === "digest" && (
                  <div className="code-block" style={{ fontSize: "0.78rem" }}>
                    <span className="cm"># Fold 64→32 bytes, finalize, hex-encode</span>{"\n"}
                    digest = <span className="fn">finalize_digest</span>(state, data){"\n"}
                    <span className="cm"># → &quot;7f91ac3b2d058e4f...&quot; (64 chars)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
