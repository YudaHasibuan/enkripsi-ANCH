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
    }, 18);
    return () => clearInterval(interval);
  }, [value]);
  return <span style={{ color: "var(--anch-cyan)", fontFamily: "var(--font-mono)" }}>{displayed}</span>;
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
    // Deterministic but visually plausible fake hex from input
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
    }, 300);
  };

  return (
    <section style={{ paddingTop: 140, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
      {/* Decorative Cyber Grid Background */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 600, backgroundImage: "radial-gradient(var(--anch-border) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.15, pointerEvents: "none", zIndex: 0 }} />

      <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Badge */}
        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <span className="badge badge-purple" style={{ padding: "6px 16px", border: "1px solid rgba(139,109,255,0.4)", boxShadow: "0 0 15px rgba(139,109,255,0.15)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={12} />
            <span>Open-Source Adaptive Hashing · v0.1.0 Released</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100" style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.03em" }}>
          <span className="gradient-text">Adaptive Neural</span>
          <br />
          <span style={{ color: "var(--anch-text)", textShadow: "0 0 40px rgba(255,255,255,0.05)" }}>Chaotic Hashing</span>
        </h1>

        <p className="animate-fade-up delay-200" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--anch-text-dim)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.75 }}>
          A secure, multi-stage experimental hashing framework. Combines <strong style={{ color: "var(--anch-purple-bright)" }}>bit-level feature extraction</strong>,{" "}
          <strong style={{ color: "var(--anch-cyan)" }}>pseudo-neural parameter generation</strong>, and{" "}
          <strong style={{ color: "var(--anch-green)" }}>chaotic state mixing</strong>.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
          <a href="#install" className="btn-primary" id="hero-install-btn">
            <Terminal size={16} />
            <span>pip install anch-hash</span>
          </a>
          <a href="#playground" className="btn-secondary" id="hero-playground-btn">
            <Play size={16} />
            <span>Try Interactive Playground</span>
          </a>
          <a href={repoUrl} target="_blank" rel="noopener" className="btn-secondary" id="hero-github-btn">
            <svg viewBox="0 0 24 24" width={16} height={16} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            <span>View on GitHub</span>
          </a>
        </div>

        {/* Live hash demo card with side-by-side Visualizer */}
        <div className="animate-fade-up delay-400 glass" style={{ maxWidth: 940, margin: "0 auto", borderRadius: 20, padding: 32, boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(139,109,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--anch-green)", display: "inline-block" }} className="animate-pulse" />
                <span>Live Engine Simulator</span>
              </span>
              <span style={{ color: "var(--anch-text-muted)", fontSize: "0.82rem" }}>Interactive Bifurcation Wave</span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)", fontFamily: "var(--font-mono)" }}>OUTPUT_BITS = 256</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, alignItems: "center" }} className="demo-grid">
            {/* Left Column: Interactive Input / Code / Output */}
            <div style={{ textAlign: "left" }}>
              <div className="code-block" style={{ marginBottom: 16, fontSize: "0.82rem", background: "rgba(10, 8, 26, 0.8)", border: "1px solid rgba(42,38,80,0.5)" }}>
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
                style={{ marginBottom: 16, fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}
              />

              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                  <span>ANCH Digest (256-bit Hex)</span>
                  <span style={{ color: "var(--anch-cyan-dim)" }}>SHANNON ENTROPY: ~4.2</span>
                </div>
                <div className="result-box" style={{ borderColor: typing ? "var(--anch-purple-dim)" : "var(--anch-border)", padding: "16px 20px" }}>
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
          <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)" }}>Quick seeds:</span>
            {["hello world", "ANCH Framework", "chaotic mapping", "cryptography"].map((sample) => (
              <button
                key={sample}
                onClick={() => handleChange(sample)}
                style={{
                  background: inputText === sample ? "rgba(139,109,255,0.12)" : "rgba(22,20,48,0.3)",
                  border: "1px solid",
                  borderColor: inputText === sample ? "var(--anch-purple)" : "rgba(42,38,80,0.6)",
                  borderRadius: 6, padding: "5px 12px", color: "var(--anch-text-dim)",
                  cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-mono)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  if (inputText !== sample) e.currentTarget.style.borderColor = "var(--anch-purple)";
                }}
                onMouseOut={(e) => {
                  if (inputText !== sample) e.currentTarget.style.borderColor = "rgba(42,38,80,0.6)";
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up delay-500 grid-4" style={{ maxWidth: 840, margin: "48px auto 0", gap: 16 }}>
          {[
            { number: "256", label: "Bit Output Digest", color: "var(--anch-purple-bright)" },
            { number: "0", label: "External Dependencies", color: "var(--anch-green)" },
            { number: "5", label: "Orchestration Stages", color: "var(--anch-cyan)" },
            { number: "v0.1.0", label: "PyPI Package Release", color: "var(--anch-orange)" },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ background: "rgba(22, 20, 48, 0.45)", border: "1px solid rgba(42,38,80,0.6)", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}>
              <div className="stat-number" style={{ color: s.color, textShadow: `0 0 20px ${s.color}22` }}>{s.number}</div>
              <div style={{ color: "var(--anch-text-muted)", fontSize: "0.8rem", fontWeight: 500 }}>{s.label}</div>
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
