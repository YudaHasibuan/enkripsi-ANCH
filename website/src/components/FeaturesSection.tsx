"use client";

const features = [
  {
    icon: "🧠",
    title: "Neural Parameter Generation",
    badge: "neural.py",
    badgeClass: "badge-purple",
    desc: "A lightweight, dependency-free pseudo-neural transform derives every hash parameter from the input's feature vector — seed, chaos r-value, rotation schedule, and compression key.",
    detail: "Two dense linear layers with LCG-derived weights map a 134-float feature vector to 16 control neurons. No NumPy or TensorFlow required.",
  },
  {
    icon: "🌀",
    title: "Chaos Theory Engine",
    badge: "chaos.py",
    badgeClass: "badge-orange",
    desc: "The logistic map x[n+1] = r·x·(1−x) in its chaotic regime (r ∈ [3.57, 4.0]) generates a pseudo-random byte stream that is exquisitely sensitive to initial conditions.",
    detail: "256-iteration warm-up discards transients. Tent map and Hénon map support coming in v0.3.",
  },
  {
    icon: "🔀",
    title: "Dynamic Permutation",
    badge: "permutation.py",
    badgeClass: "badge-cyan",
    desc: "Chaos-seeded Fisher-Yates shuffle reorders every bit in the state, while word-level rotation adds diffusion. A single input-bit change cascades across the entire 256-bit output.",
    detail: "Combines bit-level and word-level permutation in a single round for maximum diffusion with acceptable performance.",
  },
  {
    icon: "🗜️",
    title: "Multi-round Compression",
    badge: "compression.py",
    badgeClass: "badge-green",
    desc: "4–16 Feistel-style compression rounds (count determined by neural parameters) mix the 64-byte state. Each round uses a unique chaos-derived sub-key.",
    detail: "Pairwise mixing + butterfly cross-mixing + word-level diffusion chain. Final fold collapses 64→32 bytes.",
  },
  {
    icon: "🔬",
    title: "Feature Extraction",
    badge: "feature.py",
    badgeClass: "badge-purple",
    desc: "Extracts a rich 134-float feature vector from raw input: length, Hamming weight, Shannon entropy, byte-frequency distribution, mean, variance, and bigram hashes.",
    detail: "Bigram frequency encoding adds positional sensitivity — two inputs with identical byte histograms but different ordering produce different feature vectors.",
  },
  {
    icon: "📊",
    title: "Built-in Benchmark Suite",
    badge: "benchmark.py",
    badgeClass: "badge-cyan",
    desc: "BenchmarkSuite runs avalanche, entropy, collision, runtime, and SHA-256 comparison benchmarks with configurable sample counts and pretty console reporting.",
    detail: "Single-bit flip avalanche test, Shannon entropy distribution across random inputs, Fisher-Yates collision detection, per-size throughput.",
  },
  {
    icon: "🖥️",
    title: "Full CLI Interface",
    badge: "__main__.py",
    badgeClass: "badge-orange",
    desc: "Every public API function is accessible via the `anch` command — hash, verify, hash-file, avalanche, entropy, and benchmark — with clean, human-readable output.",
    detail: "Installed automatically as an entry point when you pip install anch-hash.",
  },
  {
    icon: "0️⃣",
    title: "Zero Runtime Dependencies",
    badge: "Pure Python 3.12",
    badgeClass: "badge-green",
    desc: "The entire ANCH core is implemented in pure Python 3.12 stdlib — no NumPy, no cryptography library, no external packages. Just install and go.",
    detail: "Optional: rich for colored benchmark output. TensorFlow planned for v0.3 neural mode.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section" style={{ background: "rgba(13,11,30,0.6)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-cyan" style={{ marginBottom: 16, display: "inline-block" }}>✨ Features</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            Everything You Need to <span className="gradient-text">Experiment</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 520, margin: "0 auto" }}>
            A complete adaptive hashing toolkit — from the core engine to analysis tools and CLI.
          </p>
        </div>

        <div className="grid-4" style={{ gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: "2rem", marginBottom: 14 }}>{f.icon}</div>
              <div style={{ marginBottom: 10 }}>
                <span className={`badge ${f.badgeClass}`} style={{ fontSize: "0.7rem" }}>{f.badge}</span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 10, color: "var(--anch-text)" }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: 10 }}>
                {f.desc}
              </p>
              <p style={{ color: "var(--anch-text-muted)", fontSize: "0.78rem", lineHeight: 1.6, borderTop: "1px solid var(--anch-border)", paddingTop: 10 }}>
                {f.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
