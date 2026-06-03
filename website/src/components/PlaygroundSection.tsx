"use client";
import { useState, useCallback } from "react";

// ── Client-side ANCH simulation (mirrors Python logic for demo) ──────────
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s; };
}

function simHash(input: string): string {
  if (!input) return "0".repeat(64);
  const bytes = new TextEncoder().encode(input);
  // Feature: simple checksum + length
  let featureSeed = bytes.length;
  for (const b of bytes) featureSeed = ((featureSeed << 5) - featureSeed + b) | 0;
  // Neural: derive r, chaos seed
  const rng = lcg(Math.abs(featureSeed) ^ 0xdeadbeef);
  const chaosSeed = rng();
  const r = 3.57 + (rng() / 0xffffffff) * 0.43;
  // Chaos logistic map
  let x = ((chaosSeed % 9999991) / 9999991) * 0.998 + 0.001;
  const chaosBytes: number[] = [];
  for (let i = 0; i < 300; i++) { x = r * x * (1 - x); if (i > 50) chaosBytes.push(Math.floor(x * 256) % 256); }
  // Compress: XOR bytes into 32-byte state
  const state = new Uint8Array(32);
  for (let i = 0; i < 32; i++) state[i] = (bytes[i % bytes.length] ^ chaosBytes[i] ^ (i * 7)) & 0xff;
  // Mix
  for (let round = 0; round < 8; round++)
    for (let i = 0; i < 32; i++)
      state[i] ^= (state[(i + 3) % 32] ^ chaosBytes[(i + round * 4) % chaosBytes.length]);
  return Array.from(state).map(b => b.toString(16).padStart(2, "0")).join("");
}

function simEntropy(digest: string): number {
  const bytes = digest.match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? [];
  const freq = new Array(256).fill(0);
  bytes.forEach(b => freq[b]++);
  return bytes.reduce((e, _, i, arr) => {
    const p = freq[bytes[i]] / arr.length;
    return e - (p > 0 ? p * Math.log2(p) : 0);
  }, 0);
}

function simAvalanche(a: string, b: string): number {
  const da = simHash(a), db = simHash(b);
  let diff = 0;
  for (let i = 0; i < 32; i++) {
    const xa = parseInt(da.slice(i*2, i*2+2), 16);
    const xb = parseInt(db.slice(i*2, i*2+2), 16);
    let xorVal = xa ^ xb;
    while (xorVal) { diff += xorVal & 1; xorVal >>= 1; }
  }
  return (diff / 256) * 100;
}

// ── Component ────────────────────────────────────────────────────────────
export default function PlaygroundSection() {
  const [input, setInput] = useState("hello world");
  const [tab, setTab] = useState<"hash" | "avalanche" | "entropy">("hash");
  const [input2, setInput2] = useState("Hello world");
  const [copied, setCopied] = useState(false);

  const digest = simHash(input);
  const entropy = simEntropy(digest).toFixed(4);
  const avalanche = simAvalanche(input, input2).toFixed(2);
  const sha256Sim = simHash("sha256:" + input); // just for visual comparison

  const copy = () => {
    navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const tabs = [
    { id: "hash" as const,      label: "🔐 Hash" },
    { id: "avalanche" as const, label: "💥 Avalanche" },
    { id: "entropy" as const,   label: "📊 Entropy" },
  ];

  return (
    <section id="playground" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-block" }}>🎮 Online Playground</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            Try ANCH <span className="gradient-text">Right Now</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 480, margin: "0 auto" }}>
            Interactive browser simulation of the ANCH algorithm. Real hashes run server-side via the Python package.
          </p>
        </div>

        <div className="glass" style={{ maxWidth: 840, margin: "0 auto", borderRadius: 20, padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "var(--anch-deep)", borderRadius: 10, padding: 4, marginBottom: 28, width: "fit-content" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`playground-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                style={{
                  background: tab === t.id ? "var(--anch-card)" : "transparent",
                  border: tab === t.id ? "1px solid var(--anch-border)" : "1px solid transparent",
                  borderRadius: 8, padding: "8px 18px", color: tab === t.id ? "var(--anch-text)" : "var(--anch-text-muted)",
                  cursor: "pointer", fontSize: "0.85rem", fontWeight: tab === t.id ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Hash tab */}
          {tab === "hash" && (
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", marginBottom: 8, display: "block" }}>Input</label>
              <textarea
                id="playground-hash-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="playground-input"
                rows={3}
                placeholder="Enter any text to hash…"
                style={{ marginBottom: 20 }}
              />
              <div className="grid-2" style={{ gap: 16 }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)", marginBottom: 6 }}>ANCH Digest</div>
                  <div className="result-box" style={{ color: "var(--anch-cyan)", wordBreak: "break-all", fontSize: "0.8rem" }}>
                    {digest}
                  </div>
                  <button onClick={copy} style={{ marginTop: 8, background: "none", border: "1px solid var(--anch-border)", borderRadius: 6, padding: "4px 14px", color: "var(--anch-text-dim)", cursor: "pointer", fontSize: "0.78rem" }}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--anch-text-muted)", marginBottom: 6 }}>SHA-256 (reference)</div>
                  <div className="result-box" style={{ color: "var(--anch-text-muted)", wordBreak: "break-all", fontSize: "0.8rem" }}>
                    {sha256Sim}
                  </div>
                  <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>⚠️ Simulated for UI comparison</div>
                </div>
              </div>
              <div style={{ marginTop: 20, padding: 16, background: "var(--anch-deep)", borderRadius: 10, display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>DIGEST LENGTH</div><div style={{ fontWeight: 700, color: "var(--anch-green)" }}>256 bits</div></div>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>ENTROPY</div><div style={{ fontWeight: 700, color: "var(--anch-purple-bright)" }}>{entropy} bits/byte</div></div>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>INPUT LENGTH</div><div style={{ fontWeight: 700, color: "var(--anch-cyan)" }}>{new TextEncoder().encode(input).length} bytes</div></div>
              </div>
            </div>
          )}

          {/* Avalanche tab */}
          {tab === "avalanche" && (
            <div>
              <div className="grid-2" style={{ gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", marginBottom: 8, display: "block" }}>Input A</label>
                  <input id="playground-av-a" type="text" value={input} onChange={(e) => setInput(e.target.value)} className="playground-input" />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", marginBottom: 8, display: "block" }}>Input B</label>
                  <input id="playground-av-b" type="text" value={input2} onChange={(e) => setInput2(e.target.value)} className="playground-input" />
                </div>
              </div>

              {/* Avalanche bar */}
              <div style={{ background: "var(--anch-deep)", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem" }}>Bits changed</span>
                  <span style={{ fontWeight: 800, fontSize: "1.6rem", color: parseFloat(avalanche) > 40 ? "var(--anch-green)" : "var(--anch-orange)" }}>{avalanche}%</span>
                </div>
                <div style={{ background: "var(--anch-border)", borderRadius: 100, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${avalanche}%`, height: "100%", background: "linear-gradient(90deg, var(--anch-purple), var(--anch-cyan))", borderRadius: 100, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--anch-text-muted)" }}>0%</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--anch-green)" }}>Ideal: 50%</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--anch-text-muted)" }}>100%</span>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 12, marginTop: 16 }}>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", marginBottom: 4 }}>Digest A</div><div className="result-box" style={{ color: "var(--anch-cyan)", fontSize: "0.7rem", wordBreak: "break-all" }}>{simHash(input)}</div></div>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", marginBottom: 4 }}>Digest B</div><div className="result-box" style={{ color: "var(--anch-purple-bright)", fontSize: "0.7rem", wordBreak: "break-all" }}>{simHash(input2)}</div></div>
              </div>
            </div>
          )}

          {/* Entropy tab */}
          {tab === "entropy" && (
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", marginBottom: 8, display: "block" }}>Input</label>
              <input id="playground-entropy-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} className="playground-input" style={{ marginBottom: 20 }} />

              <div style={{ background: "var(--anch-deep)", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem" }}>Shannon Entropy</span>
                  <span style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--anch-purple-bright)" }}>{entropy} <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>bits/byte</span></span>
                </div>
                <div style={{ background: "var(--anch-border)", borderRadius: 100, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${(parseFloat(entropy) / 8) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--anch-purple), var(--anch-purple-bright))", borderRadius: 100, transition: "width 0.4s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--anch-text-muted)" }}>0</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--anch-green)" }}>Ideal: 8.0 bits/byte</span>
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: "0.82rem", color: "var(--anch-text-muted)", lineHeight: 1.6 }}>
                Higher entropy (closer to 8.0 bits/byte) indicates the digest bytes are uniformly distributed — a sign of a well-diffused hash function.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
