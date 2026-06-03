"use client";
import { useState, useCallback } from "react";
import { 
  Lock, 
  Zap, 
  BarChart3, 
  Copy, 
  Check, 
  Sliders, 
  Fingerprint,
  RefreshCw
} from "lucide-react";

// ── Client-side ANCH simulation ──────────
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s; };
}

function simHash(input: string, rVal: number, rounds: number): string {
  if (!input) return "0".repeat(64);
  const bytes = new TextEncoder().encode(input);
  let featureSeed = bytes.length;
  for (const b of bytes) featureSeed = ((featureSeed << 5) - featureSeed + b) | 0;
  const rng = lcg(Math.abs(featureSeed) ^ 0xdeadbeef);
  const chaosSeed = rng();
  const r = rVal;
  let x = ((chaosSeed % 9999991) / 9999991) * 0.998 + 0.001;
  const chaosBytes: number[] = [];
  for (let i = 0; i < 300; i++) { x = r * x * (1 - x); if (i > 50) chaosBytes.push(Math.floor(x * 256) % 256); }
  const state = new Uint8Array(32);
  for (let i = 0; i < 32; i++) state[i] = (bytes[i % bytes.length] ^ chaosBytes[i] ^ (i * 7)) & 0xff;
  for (let round = 0; round < rounds; round++)
    for (let i = 0; i < 32; i++)
      state[i] ^= (state[(i + 3) % 32] ^ chaosBytes[(i + round * 4) % chaosBytes.length]);
  return Array.from(state).map(b => b.toString(16).padStart(2, "0")).join("");
}

function simEntropy(digest: string): number {
  const bytes = digest.match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? [];
  const freq = new Array(256).fill(0);
  bytes.forEach(b => freq[b]++);
  return bytes.reduce((e, _, i, arr) => {
    const p = freq[bytes[i]] / arr.length;
    return e - (p > 0 ? p * Math.log2(p) : 0);
  }, 0);
}

function simAvalanche(da: string, db: string): number {
  let diff = 0;
  for (let i = 0; i < 32; i++) {
    const xa = parseInt(da.slice(i*2, i*2+2), 16);
    const xb = parseInt(db.slice(i*2, i*2+2), 16);
    let xorVal = xa ^ xb;
    while (xorVal) { diff += xorVal & 1; xorVal >>= 1; }
  }
  return (diff / 256) * 100;
}

// Convert hex digest to a list of 256 boolean bits
function hexToBits(hex: string): boolean[] {
  const bits: boolean[] = [];
  for (let i = 0; i < hex.length; i++) {
    const val = parseInt(hex[i], 16);
    for (let b = 3; b >= 0; b--) {
      bits.push(((val >> b) & 1) === 1);
    }
  }
  while (bits.length < 256) bits.push(false);
  return bits.slice(0, 256);
}

export default function PlaygroundSection() {
  const [input, setInput] = useState("hello world");
  const [input2, setInput2] = useState("hello world!");
  const [tab, setTab] = useState<"hash" | "avalanche" | "entropy">("hash");
  const [chaosR, setChaosR] = useState(3.85);
  const [feistelRounds, setFeistelRounds] = useState(8);
  const [copied, setCopied] = useState(false);

  const digest = simHash(input, chaosR, feistelRounds);
  const digest2 = simHash(input2, chaosR, feistelRounds);
  const entropy = simEntropy(digest).toFixed(4);
  const avalanchePercent = simAvalanche(digest, digest2).toFixed(2);
  const sha256Sim = simHash("sha256:" + input, 3.99, 12); // reference hash

  const copy = () => {
    navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Compare bit differences between digest and digest2
  const bits1 = hexToBits(digest);
  const bits2 = hexToBits(digest2);
  const bitFlipMatrix = bits1.map((b1, i) => b1 !== bits2[i]);

  const tabs = [
    { id: "hash" as const,      label: "Hash",      icon: Lock },
    { id: "avalanche" as const, label: "Avalanche", icon: Zap },
    { id: "entropy" as const,   label: "Entropy",   icon: BarChart3 },
  ];

  return (
    <section id="playground" className="section" style={{ position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <Zap size={12} />
            <span>Online Playground</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Try ANCH <span className="gradient-text">Right Now</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 520, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            Interactive browser simulation. Tune the neural and chaos parameters below to visualize avalanche cascades and entropy distributions.
          </p>
        </div>

        <div className="glass" style={{ maxWidth: 940, margin: "0 auto", borderRadius: 24, padding: "36px 32px", border: "1px solid rgba(124, 93, 250, 0.25)" }}>
          
          {/* Dashboard Header - Tabs & Sliders */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, borderBottom: "1px solid rgba(124, 93, 250, 0.15)", paddingBottom: 24, marginBottom: 28, flexWrap: "wrap" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, background: "rgba(6, 4, 15, 0.8)", borderRadius: 50, padding: 6, border: "1px solid rgba(124, 93, 250, 0.15)" }}>
              {tabs.map((t) => {
                const TabIcon = t.icon;
                const isSelected = tab === t.id;
                return (
                  <button
                    key={t.id}
                    id={`playground-tab-${t.id}`}
                    onClick={() => setTab(t.id)}
                    style={{
                      background: isSelected ? "linear-gradient(135deg, var(--anch-purple) 0%, var(--anch-purple-dim) 100%)" : "transparent",
                      border: "none",
                      borderRadius: 50, 
                      padding: "8px 20px", 
                      color: isSelected ? "white" : "var(--anch-text-dim)",
                      cursor: "pointer", 
                      fontSize: "0.85rem", 
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isSelected ? "0 4px 15px rgba(124, 93, 250, 0.3)" : "none"
                    }}
                  >
                    <TabIcon size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sliders Panel */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }} className="sliders-container">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sliders size={14} style={{ color: "var(--anch-purple)" }} />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--anch-text-dim)", textTransform: "uppercase" }}>Tuning:</span>
              </div>
              
              {/* Slider 1: Chaos R */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: 140 }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 600 }}>Chaos r parameter</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-cyan)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{chaosR.toFixed(3)}</span>
                </div>
                <input 
                  type="range" 
                  min="3.57" 
                  max="4.00" 
                  step="0.01" 
                  value={chaosR} 
                  onChange={(e) => setChaosR(parseFloat(e.target.value))}
                  style={{ width: 140, accentColor: "var(--anch-cyan)", cursor: "pointer" }}
                />
              </div>

              {/* Slider 2: Feistel rounds */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: 140 }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 600 }}>Feistel Rounds</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-purple-bright)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{feistelRounds} rounds</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="16" 
                  step="1" 
                  value={feistelRounds} 
                  onChange={(e) => setFeistelRounds(parseInt(e.target.value))}
                  style={{ width: 140, accentColor: "var(--anch-purple)", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

          {/* Hash tab */}
          {tab === "hash" && (
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Input Payload</label>
              <textarea
                id="playground-hash-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="playground-input"
                rows={3}
                placeholder="Enter any text to hash…"
                style={{ marginBottom: 24, fontSize: "1rem" }}
              />
              
              <div className="grid-2" style={{ gap: 20 }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", marginBottom: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <Fingerprint size={14} style={{ color: "var(--anch-cyan)" }} />
                    <span>ANCH Simulated Hash Digest</span>
                  </div>
                  <div className="result-box" style={{ color: "var(--anch-cyan)", wordBreak: "break-all", fontSize: "0.88rem", background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124, 93, 250, 0.2)", minHeight: 74, display: "flex", alignItems: "center" }}>
                    {digest}
                  </div>
                  <button 
                    onClick={copy} 
                    className="btn-secondary"
                    style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, fontSize: "0.78rem", gap: 6 }}
                  >
                    {copied ? <Check size={12} style={{ color: "var(--anch-green)" }} /> : <Copy size={12} />}
                    <span>{copied ? "Copied!" : "Copy Hash"}</span>
                  </button>
                </div>
                
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--anch-text-muted)", marginBottom: 8, fontWeight: 700 }}>SHA-256 (Reference Mock)</div>
                  <div className="result-box" style={{ color: "var(--anch-text-muted)", wordBreak: "break-all", fontSize: "0.88rem", background: "rgba(6, 4, 15, 0.5)", border: "1px solid rgba(124, 93, 250, 0.1)", minHeight: 74, display: "flex", alignItems: "center" }}>
                    {sha256Sim}
                  </div>
                  <div style={{ marginTop: 12, fontSize: "0.72rem", color: "var(--anch-text-muted)", display: "flex", alignItems: "center", gap: 4, height: 35 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--anch-orange)", display: "inline-block" }} />
                    <span>Provided for structural size comparison</span>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata Summary */}
              <div style={{ marginTop: 24, padding: 18, background: "rgba(6, 4, 15, 0.75)", border: "1px solid rgba(124, 93, 250, 0.15)", borderRadius: 14, display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Digest Output Size</div><div style={{ fontWeight: 800, color: "var(--anch-green)", fontSize: "0.95rem" }}>256 bits (32 bytes)</div></div>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Shannon Entropy</div><div style={{ fontWeight: 800, color: "var(--anch-purple-bright)", fontSize: "0.95rem" }}>{entropy} bits/byte</div></div>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Input Size</div><div style={{ fontWeight: 800, color: "var(--anch-cyan)", fontSize: "0.95rem" }}>{new TextEncoder().encode(input).length} bytes</div></div>
              </div>
            </div>
          )}

          {/* Avalanche tab */}
          {tab === "avalanche" && (
            <div>
              <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Payload A</label>
                  <input id="playground-av-a" type="text" value={input} onChange={(e) => setInput(e.target.value)} className="playground-input" />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Payload B (Perturbed)</label>
                  <input id="playground-av-b" type="text" value={input2} onChange={(e) => setInput2(e.target.value)} className="playground-input" />
                </div>
              </div>

              {/* Grid Layout: Visual Bit matrix + Percentage */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, alignItems: "center" }} className="avalanche-grid">
                
                {/* Left: 16x16 Bit Flip Grid */}
                <div style={{ background: "rgba(6, 4, 15, 0.7)", border: "1px solid rgba(124,93,250,0.15)", borderRadius: 18, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", marginBottom: 14, fontWeight: 700 }}>256-Bit Cascade Matrix (Flipped vs Constant)</div>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(16, 1fr)", 
                    gap: 4, 
                    maxWidth: 320, 
                    margin: "0 auto" 
                  }}>
                    {bitFlipMatrix.map((isFlipped, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: 2,
                          background: isFlipped 
                            ? "linear-gradient(135deg, var(--anch-cyan) 0%, var(--anch-green) 100%)" 
                            : "rgba(124, 93, 250, 0.08)",
                          boxShadow: isFlipped ? "0 0 8px rgba(0, 240, 255, 0.8)" : "none",
                          border: isFlipped ? "1px solid white" : "1px solid rgba(255,255,255,0.02)",
                          transition: "all 0.2s"
                        }}
                        title={`Bit #${idx}: ${isFlipped ? "Flipped" : "Constant"}`}
                      />
                    ))}
                  </div>
                  
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(124, 93, 250, 0.08)", border: "1px solid rgba(255,255,255,0.05)" }} />
                      <span style={{ color: "var(--anch-text-muted)", fontWeight: 600 }}>Unchanged</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--anch-cyan)", boxShadow: "0 0 6px rgba(0,240,255,0.8)" }} />
                      <span style={{ color: "var(--anch-cyan)", fontWeight: 700 }}>Flipped (Avalanche)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Percentage & Progress Bar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124,93,250,0.15)", borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }}>
                      <span style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", fontWeight: 700 }}>Avalanche Ratio</span>
                      <span style={{ fontWeight: 900, fontSize: "2.1rem", color: parseFloat(avalanchePercent) > 40 ? "var(--anch-green)" : "var(--anch-orange)", lineHeight: 1 }}>{avalanchePercent}%</span>
                    </div>
                    
                    {/* Bar */}
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.02)" }}>
                      <div style={{ width: `${avalanchePercent}%`, height: "100%", background: "linear-gradient(90deg, var(--anch-purple), var(--anch-cyan))", borderRadius: 100, transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)" }} />
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>0%</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--anch-green)", fontWeight: 700 }}>Ideal Target: ~50.0%</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>100%</span>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", lineHeight: 1.6 }}>
                    A single bit flip in the input cascade generates a completely different chaotic schedule. In standard hashing, an avalanche factor close to 50% represents strong mathematical diffusion.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entropy tab */}
          {tab === "entropy" && (
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Input Payload</label>
              <input id="playground-entropy-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} className="playground-input" style={{ marginBottom: 24 }} />

              <div style={{ background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124,93,250,0.15)", borderRadius: 18, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }}>
                  <span style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", fontWeight: 700 }}>Shannon Entropy Index</span>
                  <span style={{ fontWeight: 900, fontSize: "2.1rem", color: "var(--anch-purple-bright)", lineHeight: 1 }}>{entropy} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--anch-text-muted)" }}>bits/byte</span></span>
                </div>
                
                {/* Bar */}
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.02)" }}>
                  <div style={{ width: `${(parseFloat(entropy) / 8) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--anch-purple), var(--anch-purple-bright))", borderRadius: 100, transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 0 10px rgba(157, 133, 255, 0.4)" }} />
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>0 (Highly Predictable)</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-green)", fontWeight: 700 }}>Perfect Random Ideal: 8.0 bits/byte</span>
                </div>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--anch-text-dim)", lineHeight: 1.7, background: "rgba(124, 93, 250, 0.04)", border: "1px solid rgba(124,93,250,0.12)", padding: 18, borderRadius: 12 }}>
                Higher entropy indicates that digest bytes are uniformly distributed across the output landscape. The chaotic mapping ensures that even simple inputs maps to high-entropy states, which blocks linear cryptanalysis attempts.
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .avalanche-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .sliders-container {
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
