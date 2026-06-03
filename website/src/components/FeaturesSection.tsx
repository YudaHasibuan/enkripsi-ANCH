"use client";
import { 
  BrainCircuit, 
  Activity, 
  Shuffle, 
  Minimize2, 
  Binary, 
  Gauge, 
  Terminal, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Neural Parameter Generation",
    badge: "neural.py",
    badgeClass: "badge-purple",
    desc: "A lightweight, dependency-free pseudo-neural transform derives every hash parameter from the input's feature vector — seed, chaos r-value, rotation schedule, and compression key.",
    detail: "Two dense linear layers with LCG-derived weights map a 134-float feature vector to 16 control control values. No external ML framework required.",
  },
  {
    icon: Activity,
    title: "Chaos Theory Engine",
    badge: "chaos.py",
    badgeClass: "badge-orange",
    desc: "A multi-attractor chaos generator leveraging the chaotic regimes of Logistic, Tent, and Hénon maps to produce a pseudo-random byte stream extremely sensitive to initial states.",
    detail: "Adaptive selector triggers Logistic Map, Tent Map, or Hénon Map dynamically based on neural seed (seed % 3). Integrated periodic boundary wrapping.",
  },
  {
    icon: Shuffle,
    title: "Dynamic Permutation",
    badge: "permutation.py",
    badgeClass: "badge-cyan",
    desc: "Chaos-seeded Fisher-Yates shuffle reorders every bit in the state, while word-level rotation adds diffusion. A single input-bit change cascades across the entire 256-bit output.",
    detail: "Combines bit-level and word-level permutation in a single round for maximum diffusion with acceptable performance.",
  },
  {
    icon: Minimize2,
    title: "Multi-round Compression",
    badge: "compression.py",
    badgeClass: "badge-green",
    desc: "4–16 Feistel-style compression rounds (count determined by neural parameters) mix the 64-byte state. Each round uses a unique chaos-derived sub-key.",
    detail: "Pairwise mixing + butterfly cross-mixing + word-level diffusion chain. Final fold collapses 64→32 bytes.",
  },
  {
    icon: Binary,
    title: "Feature Extraction",
    badge: "feature.py",
    badgeClass: "badge-purple",
    desc: "Extracts a rich 134-float feature vector from raw input: length, Hamming weight, Shannon entropy, byte-frequency distribution, mean, variance, and bigram hashes.",
    detail: "Optional NumPy acceleration provides 5x faster vectorized operations on large payloads, while preserving standard library pure-Python fallback.",
  },
  {
    icon: Gauge,
    title: "Built-in Benchmark Suite",
    badge: "benchmark.py",
    badgeClass: "badge-cyan",
    desc: "BenchmarkSuite runs avalanche, entropy, collision, runtime, and SHA-256 comparison benchmarks with configurable sample counts and pretty console reporting.",
    detail: "Single-bit flip avalanche test, Shannon entropy distribution across random inputs, Fisher-Yates collision detection, per-size throughput.",
  },
  {
    icon: Terminal,
    title: "Full CLI Interface",
    badge: "__main__.py",
    badgeClass: "badge-orange",
    desc: "Every public API function is accessible via the `anch` command — hash, verify, hash-file, avalanche, entropy, and benchmark — with clean, human-readable output.",
    detail: "Installed automatically as an entry point when you pip install anch-hash.",
  },
  {
    icon: Shield,
    title: "Zero Runtime Dependencies",
    badge: "Pure Python 3.12",
    badgeClass: "badge-green",
    desc: "The entire ANCH core is implemented in pure Python 3.12 stdlib — no NumPy, no cryptography library, no external packages. Just install and go.",
    detail: "Optional: rich for colored benchmark output. Web interface runs benchmark over connected local REST API.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section" style={{ background: "rgba(6,4,16,0.6)", position: "relative" }}>
      {/* Background glow spot */}
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 450, height: 450, background: "radial-gradient(circle, rgba(124,93,250,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 450, height: 450, background: "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-cyan" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <Activity size={12} />
            <span>Key Pillars</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Engineered for <span className="gradient-text">Chaos & Adaptability</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 540, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            ANCH decouples fixed structures by dynamically altering hash schedules based on the features of the data itself.
          </p>
        </div>

        <div className="bento-grid">
          {features.map((f, idx) => {
            const IconComponent = f.icon;
            const isLarge = idx === 0 || idx === 3 || idx === 6;
            return (
              <div 
                key={f.title} 
                className={`feature-card animate-fade-up ${isLarge ? "bento-item-large" : ""}`}
                style={{ 
                  animationDelay: `${idx * 0.05}s`,
                  background: "rgba(21, 19, 45, 0.45)", 
                  borderColor: "rgba(124, 93, 250, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ 
                    width: 52, height: 52, 
                    borderRadius: 14, 
                    background: "rgba(124, 93, 250, 0.08)", 
                    border: "1px solid rgba(124, 93, 250, 0.25)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: 24,
                    boxShadow: "0 8px 24px rgba(124, 93, 250, 0.08)"
                  }}>
                    <IconComponent size={24} style={{ color: "var(--anch-purple-bright)" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <span className={`badge ${f.badgeClass}`} style={{ fontSize: "0.68rem", padding: "4px 10px" }}>{f.badge}</span>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: 12, color: "white", letterSpacing: "-0.01em" }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--anch-text-dim)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
                    {f.desc}
                  </p>
                </div>
                <p style={{ 
                  color: "var(--anch-text-muted)", 
                  fontSize: "0.8rem", 
                  lineHeight: 1.6, 
                  borderTop: "1px solid rgba(124, 93, 250, 0.12)", 
                  paddingTop: 16,
                  marginTop: "auto",
                  fontWeight: 500
                }}>
                  {f.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
