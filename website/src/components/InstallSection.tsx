"use client";
import { useState } from "react";

const installSteps = [
  {
    title: "Install via pip",
    code: `pip install anch-hash`,
    lang: "bash",
  },
  {
    title: "Quick usage",
    code: `import anch

# Hash any string
digest = anch.hash("hello world")
print(digest)  # 64-char hex

# Verify
print(anch.verify("hello world", digest))  # True

# Hash a file
print(anch.hash_file("report.pdf"))

# Avalanche analysis
print(anch.avalanche("hello", "HELLO"))  # ~48.0%

# Entropy check
print(anch.entropy(digest))  # ~4.2 bits/byte`,
    lang: "python",
  },
  {
    title: "CLI usage",
    code: `# Hash strings and files
anch hash "hello world"
anch hash-file report.pdf

# Verify
anch verify "hello world" <digest>
anch verify-file report.pdf <digest>

# Analysis
anch avalanche "hello" "HELLO"
anch entropy <digest>

# Run benchmarks
anch benchmark --samples 200`,
    lang: "bash",
  },
  {
    title: "Benchmark suite",
    code: `from anch.benchmark import BenchmarkSuite

suite = BenchmarkSuite(samples=200, seed=42)
report = suite.run_all()
suite.print_report(report)`,
    lang: "python",
  },
];

const useCases = [
  { icon: "🧾", title: "File Integrity",       desc: "Hash files before/after transfer to detect tampering" },
  { icon: "🔑", title: "Data Fingerprinting",  desc: "Unique compact identifiers for dataset records" },
  { icon: "🧪", title: "Research & Education", desc: "Study chaos-based hashing and adaptive algorithms" },
  { icon: "🔗", title: "API Payload Verify",   desc: "Lightweight payload fingerprinting for internal APIs" },
  { icon: "📦", title: "Dataset Verification", desc: "Detect row-level changes in ML training data" },
  { icon: "⚡", title: "Benchmarking",         desc: "Compare adaptive vs fixed hash algorithms" },
];

export default function InstallSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="install" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-block" }}>🚀 Get Started</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            Install & <span className="gradient-text">Integrate</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 480, margin: "0 auto" }}>
            Zero dependencies. Works anywhere Python 3.12 runs.
          </p>
        </div>

        {/* Step selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, justifyContent: "center" }}>
          {installSteps.map((step, i) => (
            <button
              key={i}
              id={`install-tab-${i}`}
              onClick={() => setActiveStep(i)}
              style={{
                background: activeStep === i ? "rgba(139,109,255,0.15)" : "transparent",
                border: activeStep === i ? "1px solid var(--anch-purple)" : "1px solid var(--anch-border)",
                borderRadius: 8, padding: "8px 18px", color: activeStep === i ? "var(--anch-purple-bright)" : "var(--anch-text-dim)",
                cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s",
              }}
            >
              {i + 1}. {step.title}
            </button>
          ))}
        </div>

        {/* Code panel */}
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden", maxWidth: 760, margin: "0 auto 60px" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--anch-border)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: 8, fontSize: "0.78rem", color: "var(--anch-text-muted)" }}>
              {installSteps[activeStep].lang === "bash" ? "terminal" : "python"} · {installSteps[activeStep].title}
            </span>
          </div>
          <pre className="code-block" style={{ borderRadius: 0, border: "none", margin: 0, whiteSpace: "pre-wrap" }}>
            {installSteps[activeStep].code}
          </pre>
        </div>

        {/* Use cases */}
        <h3 style={{ textAlign: "center", fontWeight: 700, fontSize: "1.2rem", marginBottom: 28, color: "var(--anch-text-dim)" }}>
          Use Cases
        </h3>
        <div className="grid-3" style={{ gap: 16 }}>
          {useCases.map((u) => (
            <div key={u.title} className="feature-card" style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 20 }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{u.icon}</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{u.title}</div>
                <div style={{ color: "var(--anch-text-dim)", fontSize: "0.82rem" }}>{u.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
