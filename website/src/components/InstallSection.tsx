"use client";
import { useState } from "react";
import { 
  FileCheck, 
  Fingerprint, 
  GraduationCap, 
  Link2, 
  Database, 
  Zap,
  Terminal as TerminalIcon,
  Play,
  Copy,
  Check
} from "lucide-react";

const installSteps = [
  {
    title: "Install via pip",
    lang: "bash",
    icon: TerminalIcon,
    rawCode: `pip install anch-hash`,
    highlighted: (
      <span>
        <span className="cm"># Install the stable release directly from PyPI</span>{"\n"}
        <span className="op">$</span> pip install <span className="fn">anch-hash</span>
      </span>
    )
  },
  {
    title: "Quick usage",
    lang: "python",
    icon: Play,
    rawCode: `import anch

# Hash any string payload
digest = anch.hash("hello world")
print(digest)  # 256-bit hex output

# Cryptographic verification
is_valid = anch.verify("hello world", digest)
print(is_valid)  # True

# Native file hashing support
file_hash = anch.hash_file("dataset.csv")

# Run adaptive entropy check
bits_entropy = anch.entropy(digest)`,
    highlighted: (
      <span>
        <span className="kw">import</span> anch{"\n"}{"\n"}
        <span className="cm"># Hash any string payload</span>{"\n"}
        digest = anch.<span className="fn">hash</span>(<span className="st">&quot;hello world&quot;</span>){"\n"}
        <span className="fn">print</span>(digest)  <span className="cm"># 256-bit hex output</span>{"\n"}{"\n"}
        <span className="cm"># Cryptographic verification</span>{"\n"}
        is_valid = anch.<span className="fn">verify</span>(<span className="st">&quot;hello world&quot;</span>, digest){"\n"}
        <span className="fn">print</span>(is_valid)  <span className="cm"># True</span>{"\n"}{"\n"}
        <span className="cm"># Native file hashing support</span>{"\n"}
        file_hash = anch.<span className="fn">hash_file</span>(<span className="st">&quot;dataset.csv&quot;</span>){"\n"}{"\n"}
        <span className="cm"># Run adaptive entropy check</span>{"\n"}
        bits_entropy = anch.<span className="fn">entropy</span>(digest)
      </span>
    )
  },
  {
    title: "CLI Usage",
    lang: "bash",
    icon: TerminalIcon,
    rawCode: `# Hash strings directly from shell
anch hash "secure payload"

# Hash files natively
anch hash-file data.bin

# Verify payload against digest
anch verify "secure payload" <digest>

# Execute performance benchmark
anch benchmark --samples 200`,
    highlighted: (
      <span>
        <span className="cm"># Hash strings directly from shell</span>{"\n"}
        <span className="op">$</span> anch hash <span className="st">&quot;secure payload&quot;</span>{"\n"}{"\n"}
        <span className="cm"># Hash files natively</span>{"\n"}
        <span className="op">$</span> anch hash-file data.bin{"\n"}{"\n"}
        <span className="cm"># Verify payload against digest</span>{"\n"}
        <span className="op">$</span> anch verify <span className="st">&quot;secure payload&quot;</span> &lt;digest&gt;{"\n"}{"\n"}
        <span className="cm"># Execute performance benchmark</span>{"\n"}
        <span className="op">$</span> anch benchmark --samples <span className="nm">200</span>
      </span>
    )
  },
  {
    title: "Benchmark Suite",
    lang: "python",
    icon: Play,
    rawCode: `from anch.benchmark import BenchmarkSuite

# Run customized benchmarks
suite = BenchmarkSuite(samples=200, seed=42)
report = suite.run_all()
suite.print_report(report)`,
    highlighted: (
      <span>
        <span className="kw">from</span> anch.benchmark <span className="kw">import</span> BenchmarkSuite{"\n"}{"\n"}
        <span className="cm"># Run customized benchmarks</span>{"\n"}
        suite = <span className="fn">BenchmarkSuite</span>(samples=<span className="nm">200</span>, seed=<span className="nm">42</span>){"\n"}
        report = suite.<span className="fn">run_all</span>(){"\n"}
        suite.<span className="fn">print_report</span>(report)
      </span>
    )
  },
];

const useCases = [
  { icon: FileCheck, title: "File Integrity",       desc: "Secure hash files before/after network transfer to verify byte-exact transmission and block MITM tampering." },
  { icon: Fingerprint, title: "Data Fingerprinting",  desc: "Establish low-collision compact identifiers for unstructured JSON, APIs, or database rows." },
  { icon: GraduationCap, title: "Research & Academia", desc: "A playground for analyzing chaos theory bifurcations, neural weight mapping, and diffusion statistics." },
  { icon: Link2, title: "API Verification",      desc: "Fast, dependency-free payload verification middleware for microservices and webhook receivers." },
  { icon: Database, title: "Dataset Audits",       desc: "Detect row-level perturbations, duplicates, or column modifications in large ML preprocessing pools." },
  { icon: Zap, title: "Benchmarking",         desc: "Direct compare mathematical features and performance limits of adaptive hashes against standard blocks." },
];

export default function InstallSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(installSteps[activeStep].rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className="section" style={{ background: "rgba(8,6,22,0.8)", position: "relative" }}>
      {/* Mesh Glow Spot */}
      <div style={{ position: "absolute", top: "50%", right: "10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(0,255,170,0.03) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 54 }}>
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <TerminalIcon size={12} />
            <span>Developer Guide</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Install & <span className="gradient-text">Integrate</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 500, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            Zero dependencies. Zero system bloat. Fully compatible with Python 3.12 and newer environments.
          </p>
        </div>

        {/* Step Selector Tab Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, justifyContent: "center" }}>
          {installSteps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = activeStep === i;
            return (
              <button
                key={i}
                id={`install-tab-${i}`}
                onClick={() => { setActiveStep(i); setCopied(false); }}
                style={{
                  background: isActive ? "rgba(124, 93, 250, 0.15)" : "rgba(255,255,255,0.02)",
                  border: isActive ? "1px solid var(--anch-purple)" : "1px solid rgba(124, 93, 250, 0.15)",
                  borderRadius: 50, 
                  padding: "12px 24px", 
                  color: isActive ? "white" : "var(--anch-text-dim)",
                  cursor: "pointer", 
                  fontSize: "0.85rem", 
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 700,
                  boxShadow: isActive ? "0 4px 15px rgba(124,93,250,0.15)" : "none"
                }}
              >
                <StepIcon size={14} style={{ color: isActive ? "var(--anch-cyan)" : "var(--anch-text-muted)" }} />
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Code Terminal Box */}
        <div className="glass" style={{ borderRadius: 20, overflow: "hidden", maxWidth: 800, margin: "0 auto 80px", border: "1px solid rgba(124, 93, 250, 0.25)" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(124, 93, 250, 0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6, 4, 15, 0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
              <span style={{ marginLeft: 12, fontSize: "0.75rem", color: "var(--anch-text-muted)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                {installSteps[activeStep].lang === "bash" ? "terminal_session" : "main.py"}
              </span>
            </div>
            
            <button 
              onClick={copyCode}
              style={{
                background: "none", border: "none", color: "var(--anch-text-dim)", cursor: "pointer", 
                display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontFamily: "var(--font-inter)",
                fontWeight: 600, padding: "4px 8px", borderRadius: 4, transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "white"}
              onMouseOut={(e) => e.currentTarget.style.color = "var(--anch-text-dim)"}
            >
              {copied ? <Check size={12} style={{ color: "var(--anch-green)" }} /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="code-block" style={{ borderRadius: 0, border: "none", margin: 0, padding: "28px 32px", whiteSpace: "pre-wrap", background: "rgba(6, 4, 15, 0.85)" }}>
            {installSteps[activeStep].highlighted}
          </pre>
        </div>

        {/* Target Use Cases Layout */}
        <h3 style={{ textAlign: "center", fontWeight: 800, fontSize: "1.5rem", marginBottom: 32, color: "white", letterSpacing: "-0.01em" }}>
          Engineered for Modern Enterprise Scenarios
        </h3>
        
        <div className="grid-3" style={{ gap: 20 }}>
          {useCases.map((u) => {
            const CaseIcon = u.icon;
            return (
              <div 
                key={u.title} 
                className="feature-card" 
                style={{ 
                  display: "flex", 
                  gap: 20, 
                  alignItems: "flex-start", 
                  padding: "32px 24px",
                  background: "rgba(21, 19, 45, 0.35)",
                  borderColor: "rgba(124, 93, 250, 0.15)"
                }}
              >
                <div style={{ 
                  width: 44, height: 44, 
                  borderRadius: 10, 
                  background: "rgba(124, 93, 250, 0.08)", 
                  border: "1px solid rgba(124, 93, 250, 0.2)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <CaseIcon size={20} style={{ color: "var(--anch-cyan)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 8, color: "white", fontSize: "1.05rem" }}>{u.title}</div>
                  <div style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 500 }}>{u.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
