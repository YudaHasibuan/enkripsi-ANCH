"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Terminal } from "lucide-react";
import ChaosVisualizer from "./ChaosVisualizer";

const DEMO_DIGESTS: Record<string, string> = {
  "hello world":   "a3f92c1e8b74d056f2a19c3e7b840d52f61a9e3c8d72b1f4e056a92c3b7d4e81",
  "hello":         "7f91ac3b2d058e4f1a6c9e8b3d72f150c4a2e9b5d3f760a1c8e4b926d0f3a72e",
  "ANCH Framework":"b2e75f3a91d4c082e5b1f739c064d8a2f4b96e3c17a0d852e7f3b140c698d4a1",
};

function AnimatedDigest({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState("".padEnd(64, "·"));
  useEffect(() => {
    if (!value) { setDisplayed("".padEnd(64, "·")); return; }
    const chars = "0123456789abcdef";
    let step = 0;
    const target = value;
    const interval = setInterval(() => {
      const current = target.split("").map((ch, i) =>
        i < step ? ch : chars[Math.floor(Math.random() * 16)]
      ).join("");
      setDisplayed(current);
      step++;
      if (step > target.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [value]);
  return <span style={{ color: "var(--anch-cyan)", fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.02em" }}>{displayed}</span>;
}

export default function HeroSection() {
  const [inputText, setInputText] = useState("hello world");
  const [digest, setDigest] = useState(DEMO_DIGESTS["hello world"]);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const repoUrl = "https://github.com/YudaHasibuan/enkripsi-ANCH";

  // Simulated hash (client-side demo — real hash runs server-side)
  function simulateHash(text: string): string {
    if (DEMO_DIGESTS[text]) return DEMO_DIGESTS[text];
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed = ((seed << 5) - seed + text.charCodeAt(i)) | 0;
    const chars = "0123456789abcdef";
    let result = "";
    let s = Math.abs(seed);
    for (let i = 0; i < 64; i++) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      result += chars[Math.abs(s) % 16];
    }
    return result;
  }

  const handleChange = (val: string) => {
    setInputText(val);
    setTyping(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDigest(simulateHash(val));
      setTyping(false);
    }, 250);
  };

  return (
    <section style={{ paddingTop: 180, paddingBottom: 100, position: "relative", overflow: "hidden" }}>
      {/* Mega Glowing Orbs for Luxury Depth */}
      <div 
        className="glow-orb"
        style={{ 
          position: "absolute", 
          top: "8%", 
          left: "50%", 
          transform: "translateX(-50%)", 
          width: "550px", 
          height: "550px", 
          background: "radial-gradient(circle, rgba(124, 93, 250, 0.14) 0%, rgba(0, 240, 255, 0.04) 50%, transparent 70%)", 
          pointerEvents: "none", 
          zIndex: 0 
        }} 
      />
      <div 
        style={{ 
          position: "absolute", 
          top: "25%", 
          left: "10%", 
          width: "350px", 
          height: "350px", 
          background: "radial-gradient(circle, rgba(0, 255, 170, 0.05) 0%, transparent 70%)", 
          pointerEvents: "none", 
          zIndex: 0 
        }} 
      />
      
      {/* Decorative Cyber Grid Overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 750, backgroundImage: "radial-gradient(rgba(124, 93, 250, 0.08) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", opacity: 0.25, pointerEvents: "none", zIndex: 0 }} />

      <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Badge */}
        <div className="animate-fade-up" style={{ marginBottom: 28 }}>
          <span className="badge badge-purple" style={{ padding: "8px 20px", border: "1px solid rgba(124,93,250,0.35)", boxShadow: "0 0 20px rgba(124,93,250,0.15)", textTransform: "none", fontSize: "0.8rem", letterSpacing: "0.02em" }}>
            <Sparkles size={13} style={{ color: "var(--anch-cyan)" }} />
            <span style={{ fontWeight: 600 }}>Adaptive Neural Hashing Engine</span> · <span style={{ color: "var(--anch-cyan)", fontWeight: 700 }}>v0.1.0 Released</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100" style={{ fontSize: "clamp(2.8rem, 8vw, 5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.04em" }}>
          <span className="gradient-text">Adaptive Neural</span>
          <br />
          <span style={{ color: "var(--anch-text)", textShadow: "0 0 50px rgba(255,255,255,0.06)" }}>Chaotic Hashing</span>
        </h1>

        {/* Subtitle description */}
        <p className="animate-fade-up delay-200" style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)", color: "var(--anch-text-dim)", maxWidth: 680, margin: "0 auto 48px", lineHeight: 1.8 }}>
          A secure, multi-stage experimental hashing framework. Combines <strong style={{ color: "var(--anch-purple-bright)", fontWeight: 700 }}>bit-level feature extraction</strong>,{" "}
          <strong style={{ color: "var(--anch-cyan)", fontWeight: 700 }}>neural parameter generation</strong>, and{" "}
          <strong style={{ color: "var(--anch-green)", fontWeight: 700 }}>chaotic orbit state mixing</strong>.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 70 }}>
          <a href="#install" className="btn-primary" id="hero-install-btn" style={{ padding: "16px 36px" }}>
            <Terminal size={18} />
            <span>pip install anch-hash</span>
          </a>
          <a href="#playground" className="btn-secondary" id="hero-playground-btn" style={{ padding: "16px 36px" }}>
            <Play size={18} style={{ fill: "currentColor" }} />
            <span>Interactive Playground</span>
          </a>
        </div>

        {/* Live hash demo card with side-by-side Visualizer */}
        <div className="animate-fade-up delay-400 glass" style={{ maxWidth: 980, margin: "0 auto", borderRadius: 24, padding: "36px 32px", border: "1px solid rgba(124, 93, 250, 0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", textTransform: "none" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--anch-green)", display: "inline-block" }} className="animate-pulse" />
                <span style={{ fontWeight: 700 }}>Live Engine Simulator</span>
              </span>
              <span style={{ color: "var(--anch-text-muted)", fontSize: "0.85rem", fontWeight: 500 }}>Interactive Bifurcation Wave</span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--anch-text-muted)", fontFamily: "var(--font-mono)", border: "1px solid rgba(124,93,250,0.15)", padding: "3px 10px", borderRadius: 6, background: "rgba(0,0,0,0.2)" }}>OUTPUT_BITS = 256</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 36, alignItems: "center" }} className="demo-grid">
            {/* Left Column: Interactive Input / Code / Output */}
            <div style={{ textAlign: "left" }}>
              <div className="code-block" style={{ marginBottom: 20, fontSize: "0.85rem", background: "rgba(6, 4, 15, 0.85)", border: "1px solid rgba(124,93,250,0.2)" }}>
                <span className="kw">import</span> anch
                <br />
                digest = anch.<span className="fn">hash</span>(<span className="st">&quot;{inputText}&quot;</span>)
              </div>

              <input
                id="hero-hash-input"
                type="text"
                value={inputText}
                onChange={(e) => handleChange(e.target.value)}
                className="playground-input"
                placeholder="Type something to perturb the chaotic regime…"
                style={{ marginBottom: 20, fontFamily: "var(--font-mono)", fontSize: "1rem", height: 54 }}
              />

              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                  <span>ANCH Digest (256-bit Hex)</span>
                  <span style={{ color: "var(--anch-cyan-dim)" }}>SHANNON ENTROPY: ~4.2 bits/byte</span>
                </div>
                <div className="result-box" style={{ borderColor: typing ? "rgba(0, 240, 255, 0.4)" : "rgba(124,93,250,0.2)", padding: "18px 22px", background: "rgba(6, 4, 15, 0.8)" }}>
                  <AnimatedDigest value={digest} />
                </div>
              </div>
            </div>

            {/* Right Column: Chaos Visualizer */}
            <div>
              <ChaosVisualizer inputText={inputText} />
            </div>
          </div>

          {/* Quick inputs */}
          <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", fontWeight: 600 }}>Perturbation Seeds:</span>
            {["hello world", "ANCH Framework", "chaotic mapping", "cryptography"].map((sample) => (
              <button
                key={sample}
                onClick={() => handleChange(sample)}
                style={{
                  background: inputText === sample ? "rgba(0, 240, 255, 0.12)" : "rgba(124,93,250,0.05)",
                  border: "1px solid",
                  borderColor: inputText === sample ? "var(--anch-cyan)" : "rgba(124,93,250,0.2)",
                  borderRadius: 8, padding: "6px 14px", color: inputText === sample ? "white" : "var(--anch-text-dim)",
                  cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-mono)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontWeight: inputText === sample ? 600 : 400
                }}
                onMouseOver={(e) => {
                  if (inputText !== sample) {
                    e.currentTarget.style.borderColor = "var(--anch-purple)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseOut={(e) => {
                  if (inputText !== sample) {
                    e.currentTarget.style.borderColor = "rgba(124,93,250,0.2)";
                    e.currentTarget.style.color = "var(--anch-text-dim)";
                  }
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up delay-500 grid-4" style={{ maxWidth: 900, margin: "64px auto 0", gap: 20 }}>
          {[
            { number: "256", label: "Bit Output Digest", color: "var(--anch-purple-bright)" },
            { number: "0", label: "Runtime Dependencies", color: "var(--anch-green)" },
            { number: "5", label: "Pipeline Stages", color: "var(--anch-cyan)" },
            { number: "v0.1.0", label: "PyPI Package Release", color: "var(--anch-orange)" },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ background: "rgba(21, 19, 45, 0.4)", borderColor: "rgba(124, 93, 250, 0.25)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
              <div className="stat-number" style={{ color: s.color, textShadow: `0 0 25px ${s.color}25` }}>{s.number}</div>
              <div style={{ color: "var(--anch-text-muted)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.02em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .demo-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
