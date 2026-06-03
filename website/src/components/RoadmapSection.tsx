"use client";
import { 
  Milestone, 
  CheckCircle2, 
  Circle,
  HelpCircle
} from "lucide-react";

interface RoadmapItem {
  text: string;
  completed: boolean;
}

interface RoadmapPhase {
  version: string;
  status: "released" | "active" | "planned";
  label: string;
  badgeClass: string;
  color: string;
  items: RoadmapItem[];
}

const roadmap: RoadmapPhase[] = [
  {
    version: "v0.1",
    status: "released",
    label: "Foundation",
    badgeClass: "badge-green",
    color: "var(--anch-green)",
    items: [
      { text: "Core Hash Engine (feature → neural → chaos → permutation → compression)", completed: true },
      { text: "Pure Python 3.12, zero runtime dependencies", completed: true },
      { text: "Public API: hash, verify, hash_file, avalanche, entropy, collision_test", completed: true },
      { text: "Full CLI interface (anch hash, anch benchmark, …)", completed: true },
      { text: "Comprehensive test suite (pytest)", completed: true },
      { text: "pyproject.toml setup, pip-installable", completed: true },
      { text: "Interactive showcase website", completed: true },
    ],
  },
  {
    version: "v0.2",
    status: "released",
    label: "Optimization",
    badgeClass: "badge-green",
    color: "var(--anch-green)",
    items: [
      { text: "Benchmark Suite interactive dashboard UI", completed: true },
      { text: "REST API (FastAPI + Uvicorn) — POST /hash, /verify, /benchmark", completed: true },
      { text: "Online Playground (server-side real ANCH hashing)", completed: true },
      { text: "Performance: NumPy-accelerated feature extraction", completed: true },
      { text: "MkDocs documentation site (Material theme)", completed: true },
      { text: "GitHub Actions automated CI/CD pipeline", completed: true },
    ],
  },
  {
    version: "v0.3",
    status: "active",
    label: "Cryptography",
    badgeClass: "badge-purple",
    color: "var(--anch-purple)",
    items: [
      { text: "Multi-Chaotic Engine: Tent Map + Hénon Map", completed: true },
      { text: "Adaptive Attractor selection (seed % 3)", completed: true },
      { text: "Streaming hashing for large files / data pools", completed: true },
      { text: "Dynamic S-Box key-schedule generation", completed: false },
      { text: "HMAC-ANCH authentication mode support", completed: false },
      { text: "Language bindings: JS/WASM or Rust ports", completed: false },
    ],
  },
  {
    version: "v1.0",
    status: "planned",
    label: "Final Scope",
    badgeClass: "badge-orange",
    color: "var(--anch-orange)",
    items: [
      { text: "Full public framework production release", completed: false },
      { text: "Complete developer SDK stable release", completed: false },
      { text: "Formal third-party academic security audit", completed: false },
      { text: "Academic research paper submission", completed: false },
      { text: "1,000+ PyPI downloads milestone 🎉", completed: false },
    ],
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="section" style={{ background: "rgba(13,11,30,0.5)", position: "relative", overflow: "hidden" }}>
      {/* Background radial glow */}
      <div style={{ position: "absolute", bottom: "-10%", right: "20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(124,93,250,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Milestone size={12} />
            <span>Development Map</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Where We&apos;re <span className="gradient-text">Headed</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 500, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            ANCH is evolving from a mathematical concept into an enterprise-ready adaptive cryptographic engine.
          </p>
        </div>

        <div className="grid-4" style={{ gap: 20 }}>
          {roadmap.map((phase) => {
            const isReleased = phase.status === "released";
            const isActive = phase.status === "active";
            const isPlanned = phase.status === "planned";
            return (
              <div
                key={phase.version}
                className="feature-card"
                style={{
                  borderColor: isReleased 
                    ? "rgba(0, 255, 170, 0.35)" 
                    : isActive 
                      ? "rgba(124, 93, 250, 0.45)" 
                      : "rgba(124, 93, 250, 0.15)",
                  background: isReleased 
                    ? "rgba(21, 19, 45, 0.6)" 
                    : isActive
                      ? "rgba(25, 20, 55, 0.65)"
                      : "rgba(21, 19, 45, 0.4)",
                  padding: "32px 24px",
                  boxShadow: isReleased 
                    ? "0 15px 40px rgba(0,0,0,0.5), 0 0 25px rgba(0,255,170,0.06)" 
                    : isActive 
                      ? "0 15px 40px rgba(0,0,0,0.5), 0 0 25px rgba(124,93,250,0.08)"
                      : "0 10px 30px rgba(0,0,0,0.3)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {/* Visual indicator of active roadmap phase */}
                {isReleased && (
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: "linear-gradient(90deg, transparent, var(--anch-green), transparent)" }} />
                )}
                {isActive && (
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: "linear-gradient(90deg, transparent, var(--anch-purple), transparent)" }} />
                )}

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>{phase.version}</span>
                    <span className={`badge ${phase.badgeClass}`} style={{ padding: "4px 12px", fontSize: "0.68rem" }}>{phase.label}</span>
                  </div>
                  
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, padding: 0 }}>
                    {phase.items.map((item) => (
                      <li key={item.text} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ flexShrink: 0, marginTop: 3 }}>
                          {item.completed ? (
                            <CheckCircle2 size={13} style={{ color: "var(--anch-green)" }} />
                          ) : (
                            <Circle size={13} style={{ color: "var(--anch-text-muted)" }} />
                          )}
                        </span>
                        <span style={{ color: item.completed ? "var(--anch-text)" : "var(--anch-text-dim)", fontSize: "0.82rem", lineHeight: 1.5, fontWeight: 500 }}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
