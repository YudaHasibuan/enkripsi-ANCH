"use client";
import { useState } from "react";
import { 
  FileCheck, 
  Fingerprint, 
  GraduationCap, 
  Link2, 
  Database, 
  Zap,
  Terminal,
  Play
} from "lucide-react";

const installSteps = [
  {
    title: "Install via pip",
    code: `pip install anch-hash`,
    lang: "bash",
    icon: Terminal
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
    icon: Play
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
    icon: Terminal
  },
  {
    title: "Benchmark suite",
    code: `from anch.benchmark import BenchmarkSuite

suite = BenchmarkSuite(samples=200, seed=42)
report = suite.run_all()
suite.print_report(report)`,
    lang: "python",
    icon: Play
  },
];

const useCases = [
  { icon: FileCheck, title: "File Integrity",       desc: "Hash files before/after transfer to detect tampering" },
  { icon: Fingerprint, title: "Data Fingerprinting",  desc: "Unique compact identifiers for dataset records" },
  { icon: GraduationCap, title: "Research & Education", desc: "Study chaos-based hashing and adaptive algorithms" },
  { icon: Link2, title: "API Payload Verify",   desc: "Lightweight payload fingerprinting for internal APIs" },
  { icon: Database, title: "Dataset Verification", desc: "Detect row-level changes in ML training data" },
  { icon: Zap, title: "Benchmarking",         desc: "Compare adaptive vs fixed hash algorithms" },
];

export default function InstallSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="install" className="section" style={{ background: "rgba(8,6,22,0.8)", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-block", padding: "5px 14px" }}>🚀 Get Started</span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Install & <span className="gradient-text">Integrate</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 480, margin: "0 auto", fontSize: "1.05rem" }}>
            Zero dependencies. Works anywhere Python 3.12 runs.
          </p>
        </div>

        {/* Step selector */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, justifyContent: "center" }}>
          {installSteps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <button
                key={i}
                id={`install-tab-${i}`}
                onClick={() => setActiveStep(i)}
                style={{
                  background: activeStep === i ? "rgba(139,109,255,0.12)" : "rgba(22,20,48,0.3)",
                  border: activeStep === i ? "1px solid var(--anch-purple)" : "1px solid rgba(42,38,80,0.6)",
                  borderRadius: 10, 
                  padding: "10px 20px", 
                  color: activeStep === i ? "var(--anch-purple-bright)" : "var(--anch-text-dim)",
                  cursor: "pointer", 
                  fontSize: "0.85rem", 
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: activeStep === i ? 600 : 500,
                  boxShadow: activeStep === i ? "0 4px 12px rgba(139,109,255,0.1)" : "none"
                }}
              >
                <StepIcon size={14} />
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Code panel */}
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden", maxWidth: 760, margin: "0 auto 60px", background: "rgba(18, 16, 42, 0.55)", borderColor: "rgba(42,38,80,0.8)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(42,38,80,0.6)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: 12, fontSize: "0.78rem", color: "var(--anch-text-muted)" }}>
              {installSteps[activeStep].lang === "bash" ? "terminal" : "python"} · {installSteps[activeStep].title}
            </span>
          </div>
          <pre className="code-block" style={{ borderRadius: 0, border: "none", margin: 0, whiteSpace: "pre-wrap", background: "rgba(10, 8, 26, 0.85)" }}>
            {installSteps[activeStep].code}
          </pre>
        </div>

        {/* Use cases */}
        <h3 style={{ textAlign: "center", fontWeight: 700, fontSize: "1.3rem", marginBottom: 28, color: "var(--anch-text-dim)" }}>
          Target Use Cases
        </h3>
        <div className="grid-3" style={{ gap: 16 }}>
          {useCases.map((u) => {
            const CaseIcon = u.icon;
            return (
              <div 
                key={u.title} 
                className="feature-card" 
                style={{ 
                  display: "flex", 
                  gap: 16, 
                  alignItems: "flex-start", 
                  padding: "24px 20px",
                  background: "rgba(22, 20, 48, 0.45)",
                  borderColor: "rgba(42,38,80,0.6)"
                }}
              >
                <div style={{ 
                  width: 40, height: 40, 
                  borderRadius: 8, 
                  background: "rgba(139,109,255,0.06)", 
                  border: "1px solid rgba(139,109,255,0.15)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <CaseIcon size={18} style={{ color: "var(--anch-purple)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--anch-text)" }}>{u.title}</div>
                  <div style={{ color: "var(--anch-text-dim)", fontSize: "0.82rem", lineHeight: 1.6 }}>{u.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
