"use client";
import { 
  Milestone, 
  CheckCircle2, 
  Circle 
} from "lucide-react";

const roadmap = [
  {
    version: "v0.1",
    status: "released",
    label: "Current",
    badgeClass: "badge-green",
    items: [
      "Core Hash Engine (feature → neural → chaos → permutation → compression)",
      "Pure Python 3.12, zero dependencies",
      "Public API: hash, verify, hash_file, verify_file, avalanche, entropy, collision_test",
      "Full CLI interface (anch hash, anch benchmark, …)",
      "Comprehensive test suite (pytest)",
      "pyproject.toml, pip-installable",
      "Documentation website",
    ],
  },
  {
    version: "v0.2",
    status: "planned",
    label: "Next",
    badgeClass: "badge-purple",
    items: [
      "Benchmark Suite interactive UI",
      "REST API (FastAPI + Uvicorn) — POST /hash, /verify, /benchmark",
      "Online Playground (server-side real ANCH hashing)",
      "Performance: NumPy-accelerated feature extraction",
      "MkDocs documentation site (Material theme)",
      "GitHub Actions CI/CD pipeline",
    ],
  },
  {
    version: "v0.3",
    status: "planned",
    label: "Future",
    badgeClass: "badge-orange",
    items: [
      "Multi-Chaotic Engine: Tent Map + Hénon Map",
      "TensorFlow integration (optional neural mode)",
      "Dynamic S-Box generation",
      "Streaming hashing for arbitrarily large files",
      "HMAC-ANCH mode for keyed authentication",
      "Language bindings: JS/WASM, Rust",
    ],
  },
  {
    version: "v1.0",
    status: "future",
    label: "Goal",
    badgeClass: "badge-cyan",
    items: [
      "Full public framework release",
      "Complete developer SDK",
      "Community plugin system",
      "Formal security audit & disclosure",
      "Academic paper submission",
      "100+ PyPI installs 🎉",
    ],
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="section" style={{ background: "rgba(13,11,30,0.5)", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Milestone size={12} />
            <span>Roadmap</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Where We&apos;re <span className="gradient-text">Headed</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 480, margin: "0 auto", fontSize: "1.05rem" }}>
            ANCH is evolving from a proof-of-concept into a full adaptive hashing platform.
          </p>
        </div>

        <div className="grid-4" style={{ gap: 20 }}>
          {roadmap.map((phase) => (
            <div
              key={phase.version}
              className="feature-card"
              style={{
                opacity: phase.status === "released" ? 1 : phase.status === "planned" ? 0.9 : 0.7,
                borderColor: phase.status === "released" ? "rgba(0,255,170,0.3)" : "rgba(42,38,80,0.6)",
                background: "rgba(22, 20, 48, 0.45)",
                padding: "28px 24px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--anch-text)", letterSpacing: "-0.01em" }}>{phase.version}</span>
                <span className={`badge ${phase.badgeClass}`} style={{ padding: "3px 10px", fontSize: "0.7rem" }}>{phase.label}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, padding: 0 }}>
                {phase.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>
                      {phase.status === "released" ? (
                        <CheckCircle2 size={14} style={{ color: "var(--anch-green)" }} />
                      ) : (
                        <Circle size={14} style={{ color: "var(--anch-text-muted)" }} />
                      )}
                    </span>
                    <span style={{ color: phase.status === "released" ? "var(--anch-text-dim)" : "var(--anch-text-muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
