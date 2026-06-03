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
    label: "Current Release",
    badgeClass: "badge-green",
    color: "var(--anch-green)",
    items: [
      "Core Hash Engine (feature → neural → chaos → permutation → compression)",
      "Pure Python 3.12, zero runtime dependencies",
      "Public API: hash, verify, hash_file, verify_file, avalanche, entropy, collision_test",
      "Full CLI interface (anch hash, anch benchmark, …)",
      "Comprehensive test suite (pytest)",
      "pyproject.toml setup, pip-installable",
      "Interactive showcase website",
    ],
  },
  {
    version: "v0.2",
    status: "planned",
    label: "Next Milestone",
    badgeClass: "badge-purple",
    color: "var(--anch-purple)",
    items: [
      "Benchmark Suite interactive dashboard UI",
      "REST API (FastAPI + Uvicorn) — POST /hash, /verify, /benchmark",
      "Online Playground (server-side real ANCH hashing)",
      "Performance: NumPy-accelerated feature extraction",
      "MkDocs documentation site (Material theme)",
      "GitHub Actions automated CI/CD pipeline",
    ],
  },
  {
    version: "v0.3",
    status: "planned",
    label: "Future Scope",
    badgeClass: "badge-orange",
    color: "var(--anch-orange)",
    items: [
      "Multi-Chaotic Engine: Tent Map + Hénon Map",
      "TensorFlow integration (optional neural mode)",
      "Dynamic S-Box key-schedule generation",
      "Streaming hashing for large data pools",
      "HMAC-ANCH mode for authentication",
      "Language bindings: JS/WASM, Rust",
    ],
  },
  {
    version: "v1.0",
    status: "future",
    label: "Final Goal",
    badgeClass: "badge-cyan",
    color: "var(--anch-cyan)",
    items: [
      "Full public framework release",
      "Complete developer SDK",
      "Community plugin system",
      "Formal third-party security audit",
      "Academic research paper submission",
      "1,000+ PyPI downloads milestone 🎉",
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
            const isNext = phase.version === "v0.2";
            return (
              <div
                key={phase.version}
                className="feature-card"
                style={{
                  opacity: isReleased ? 1 : 0.88,
                  borderColor: isReleased 
                    ? "rgba(0, 255, 170, 0.35)" 
                    : isNext 
                      ? "rgba(124, 93, 250, 0.4)" 
                      : "rgba(124, 93, 250, 0.15)",
                  background: isReleased 
                    ? "rgba(21, 19, 45, 0.6)" 
                    : "rgba(21, 19, 45, 0.4)",
                  padding: "32px 24px",
                  boxShadow: isReleased 
                    ? "0 15px 40px rgba(0,0,0,0.5), 0 0 25px rgba(0,255,170,0.06)" 
                    : isNext 
                      ? "0 15px 40px rgba(0,0,0,0.5), 0 0 25px rgba(124,93,250,0.05)"
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
                {isNext && (
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: "linear-gradient(90deg, transparent, var(--anch-purple), transparent)" }} />
                )}

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>{phase.version}</span>
                    <span className={`badge ${phase.badgeClass}`} style={{ padding: "4px 12px", fontSize: "0.68rem" }}>{phase.label}</span>
                  </div>
                  
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, padding: 0 }}>
                    {phase.items.map((item) => (
                      <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ flexShrink: 0, marginTop: 3 }}>
                          {isReleased ? (
                            <CheckCircle2 size={13} style={{ color: "var(--anch-green)" }} />
                          ) : (
                            <Circle size={13} style={{ color: "var(--anch-text-muted)" }} />
                          )}
                        </span>
                        <span style={{ color: isReleased ? "var(--anch-text)" : "var(--anch-text-dim)", fontSize: "0.82rem", lineHeight: 1.5, fontWeight: 500 }}>
                          {item}
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
