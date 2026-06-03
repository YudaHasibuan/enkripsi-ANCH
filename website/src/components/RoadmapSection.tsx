"use client";

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
    <section id="roadmap" className="section" style={{ background: "rgba(13,11,30,0.5)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-block" }}>🗺️ Roadmap</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            Where We&apos;re <span className="gradient-text">Headed</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 480, margin: "0 auto" }}>
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
                borderColor: phase.status === "released" ? "rgba(0,255,170,0.3)" : "var(--anch-border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--anch-text)" }}>{phase.version}</span>
                <span className={`badge ${phase.badgeClass}`}>{phase.label}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {phase.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: phase.status === "released" ? "var(--anch-green)" : "var(--anch-text-muted)", flexShrink: 0, marginTop: 2 }}>
                      {phase.status === "released" ? "✓" : "○"}
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
