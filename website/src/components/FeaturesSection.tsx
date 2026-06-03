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
    detail: "Two dense linear layers with LCG-derived weights map a 134-float feature vector to 16 control neurons. No NumPy or TensorFlow required.",
  },
  {
    icon: Activity,
    title: "Chaos Theory Engine",
    badge: "chaos.py",
    badgeClass: "badge-orange",
    desc: "The logistic map x[n+1] = r·x·(1−x) in its chaotic regime (r ∈ [3.57, 4.0]) generates a pseudo-random byte stream that is exquisitely sensitive to initial conditions.",
    detail: "256-iteration warm-up discards transients. Tent map and Hénon map support coming in v0.3.",
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
    detail: "Bigram frequency encoding adds positional sensitivity — two inputs with identical byte histograms but different ordering produce different feature vectors.",
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
    detail: "Optional: rich for colored benchmark output. TensorFlow planned for v0.3 neural mode.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section" style={{ background: "rgba(8,6,22,0.8)", position: "relative" }}>
      {/* Background glow spot */}
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 350, height: 350, background: "radial-gradient(circle, rgba(139,109,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 350, height: 350, background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-cyan" style={{ marginBottom: 16, display: "inline-block", padding: "5px 14px" }}>⚡ Key Pillars</span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Engineered for <span className="gradient-text">Chaos & Adaptability</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 540, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.7 }}>
            ANCH decouples fixed structures by dynamically altering hash schedules based on the features of the data itself.
          </p>
        </div>

        <div className="grid-4" style={{ gap: 20 }}>
          {features.map((f, idx) => {
            const IconComponent = f.icon;
            return (
              <div 
                key={f.title} 
                className="feature-card animate-fade-up" 
                style={{ 
                  animationDelay: `${idx * 0.05}s`,
                  background: "rgba(22, 20, 48, 0.45)", 
                  borderColor: "rgba(42,38,80,0.6)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ 
                    width: 52, height: 52, 
                    borderRadius: 12, 
                    background: "rgba(139,109,255,0.08)", 
                    border: "1px solid rgba(139,109,255,0.2)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: 20,
                    boxShadow: "0 8px 24px rgba(139,109,255,0.05)"
                  }}>
                    <IconComponent size={24} style={{ color: "var(--anch-purple)" }} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <span className={`badge ${f.badgeClass}`} style={{ fontSize: "0.68rem", padding: "3px 10px" }}>{f.badge}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 12, color: "var(--anch-text)" }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: 16 }}>
                    {f.desc}
                  </p>
                </div>
                <p style={{ 
                  color: "var(--anch-text-muted)", 
                  fontSize: "0.78rem", 
                  lineHeight: 1.6, 
                  borderTop: "1px solid rgba(42,38,80,0.5)", 
                  paddingTop: 12,
                  marginTop: "auto"
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
