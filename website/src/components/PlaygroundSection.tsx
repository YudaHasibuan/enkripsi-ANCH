"use client";
import { useState, useCallback, useEffect } from "react";
import { 
  Lock, 
  Zap, 
  BarChart3, 
  Copy, 
  Check, 
  Sliders, 
  Fingerprint,
  Cpu
} from "lucide-react";

// ── Client-side ANCH simulation ──────────
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s; };
}

function simHash(input: string, rVal: number, rounds: number): string {
  if (!input) return "0".repeat(64);
  const bytes = new TextEncoder().encode(input);
  let featureSeed = bytes.length;
  for (const b of bytes) featureSeed = ((featureSeed << 5) - featureSeed + b) | 0;
  const rng = lcg(Math.abs(featureSeed) ^ 0xdeadbeef);
  const chaosSeed = rng();
  const r = rVal;
  let x = ((chaosSeed % 9999991) / 9999991) * 0.998 + 0.001;
  const chaosBytes: number[] = [];
  for (let i = 0; i < 300; i++) { x = r * x * (1 - x); if (i > 50) chaosBytes.push(Math.floor(x * 256) % 256); }
  const state = new Uint8Array(32);
  for (let i = 0; i < 32; i++) state[i] = (bytes[i % bytes.length] ^ chaosBytes[i] ^ (i * 7)) & 0xff;
  for (let round = 0; round < rounds; round++)
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

function simAvalanche(da: string, db: string): number {
  let diff = 0;
  for (let i = 0; i < 32; i++) {
    const xa = parseInt(da.slice(i*2, i*2+2), 16);
    const xb = parseInt(db.slice(i*2, i*2+2), 16);
    let xorVal = xa ^ xb;
    while (xorVal) { diff += xorVal & 1; xorVal >>= 1; }
  }
  return (diff / 256) * 100;
}

function simHmac(key: string, message: string, rVal: number, rounds: number): string {
  const block_size = 64;
  let keyBytes = new TextEncoder().encode(key);
  if (keyBytes.length > block_size) {
    const hashedKey = simHash(key, rVal, rounds);
    keyBytes = new Uint8Array(hashedKey.match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? []);
  }
  const paddedKey = new Uint8Array(block_size);
  paddedKey.set(keyBytes);
  const ipad = new Uint8Array(block_size);
  const opad = new Uint8Array(block_size);
  for (let i = 0; i < block_size; i++) {
    ipad[i] = paddedKey[i] ^ 0x36;
    opad[i] = paddedKey[i] ^ 0x5C;
  }
  const msgBytes = new TextEncoder().encode(message);
  const innerInput = new Uint8Array(block_size + msgBytes.length);
  innerInput.set(ipad, 0);
  innerInput.set(msgBytes, block_size);
  const innerInputStr = Array.from(innerInput).map(b => String.fromCharCode(b)).join("");
  const innerHashHex = simHash(innerInputStr, rVal, rounds);
  const innerHashBytes = new Uint8Array(innerHashHex.match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? []);
  const outerInput = new Uint8Array(block_size + innerHashBytes.length);
  outerInput.set(opad, 0);
  outerInput.set(innerHashBytes, block_size);
  const outerInputStr = Array.from(outerInput).map(b => String.fromCharCode(b)).join("");
  return simHash(outerInputStr, rVal, rounds);
}

// Convert hex digest to a list of 256 boolean bits
function hexToBits(hex: string): boolean[] {
  const bits: boolean[] = [];
  for (let i = 0; i < hex.length; i++) {
    const val = parseInt(hex[i], 16);
    for (let b = 3; b >= 0; b--) {
      bits.push(((val >> b) & 1) === 1);
    }
  }
  while (bits.length < 256) bits.push(false);
  return bits.slice(0, 256);
}

export default function PlaygroundSection() {
  const [input, setInput] = useState("hello world");
  const [input2, setInput2] = useState("hello world!");
  const [tab, setTab] = useState<"hash" | "avalanche" | "entropy" | "hmac">("hash");
  const [chaosR, setChaosR] = useState(3.85);
  const [feistelRounds, setFeistelRounds] = useState(8);
  const [copied, setCopied] = useState(false);

  // HMAC States
  const [hmacKey, setHmacKey] = useState("secret_key");
  const [hmacMessage, setHmacMessage] = useState("hello world");
  const [apiHmac, setApiHmac] = useState("");
  const [hmacCopied, setHmacCopied] = useState(false);
  const [hmacVerifyInput, setHmacVerifyInput] = useState("");
  const [hmacVerified, setHmacVerified] = useState<boolean | null>(null);

  // API Integration States
  const [isApiActive, setIsApiActive] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiDigest1, setApiDigest1] = useState("");
  const [apiDigest2, setApiDigest2] = useState("");
  const [apiEntropyVal, setApiEntropyVal] = useState<number | null>(null);
  const [apiAvalancheVal, setApiAvalancheVal] = useState<number | null>(null);
  const [apiBitFlipMatrix, setApiBitFlipMatrix] = useState<boolean[]>([]);
  const [timeTakenMs, setTimeTakenMs] = useState<number | null>(null);
  const [neuralParams, setNeuralParams] = useState<any>(null);

  // Ping API Server
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch("http://localhost:8000/", { signal: AbortSignal.timeout(1500) });
        const data = await res.json();
        if (data.status === "online") {
          setIsApiActive(true);
        }
      } catch (e) {
        setIsApiActive(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, []);

  // Fetch real hash metrics when inputs change (if API is active)
  useEffect(() => {
    if (!isApiActive) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setApiLoading(true);
      try {
        // Fetch Hash for Payload A
        const hashRes1 = await fetch("http://localhost:8000/hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: input }),
          signal: controller.signal
        });
        const hashData1 = await hashRes1.json();
        setApiDigest1(hashData1.digest);
        setTimeTakenMs(hashData1.time_taken_ms);
        setNeuralParams(hashData1.neural_params);

        // Fetch Hash for Payload B
        const hashRes2 = await fetch("http://localhost:8000/hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: input2 }),
          signal: controller.signal
        });
        const hashData2 = await hashRes2.json();
        setApiDigest2(hashData2.digest);

        // Fetch Avalanche metrics
        const avRes = await fetch("http://localhost:8000/avalanche", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data_a: input, data_b: input2 }),
          signal: controller.signal
        });
        const avData = await avRes.json();
        setApiAvalancheVal(avData.avalanche_percentage);

        // Fetch Entropy for Payload A
        const entRes = await fetch("http://localhost:8000/entropy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ digest: hashData1.digest }),
          signal: controller.signal
        });
        const entData = await entRes.json();
        setApiEntropyVal(entData.entropy);

        // Calculate Bit Matrix
        const bits1 = hexToBits(hashData1.digest);
        const bits2 = hexToBits(hashData2.digest);
        setApiBitFlipMatrix(bits1.map((b1, i) => b1 !== bits2[i]));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Playground API fetch failed", err);
        }
      } finally {
        setApiLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input, input2, isApiActive]);

  // Fetch real HMAC metrics when HMAC key or message change (if API is active)
  useEffect(() => {
    if (!isApiActive) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const hmacRes = await fetch("http://localhost:8000/hmac", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: hmacKey, message: hmacMessage }),
          signal: controller.signal
        });
        const hmacData = await hmacRes.json();
        setApiHmac(hmacData.mac);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("HMAC API fetch failed", err);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [hmacKey, hmacMessage, isApiActive]);

  const handleVerifyHmac = async () => {
    if (isApiActive) {
      try {
        const res = await fetch("http://localhost:8000/hmac/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: hmacKey, message: hmacMessage, mac: hmacVerifyInput })
        });
        const data = await res.json();
        setHmacVerified(data.verified);
      } catch (e) {
        console.error("HMAC verification failed", e);
      }
    } else {
      const computed = simHmac(hmacKey, hmacMessage, chaosR, feistelRounds);
      setHmacVerified(computed.toLowerCase() === hmacVerifyInput.trim().toLowerCase());
    }
  };

  // Compute final display outputs
  const simDigest1 = simHash(input, chaosR, feistelRounds);
  const simDigest2 = simHash(input2, chaosR, feistelRounds);

  const activeDigest = isApiActive ? (apiDigest1 || simDigest1) : simDigest1;
  const activeDigest2 = isApiActive ? (apiDigest2 || simDigest2) : simDigest2;
  
  const activeEntropy = isApiActive 
    ? (apiEntropyVal !== null ? apiEntropyVal.toFixed(4) : simEntropy(simDigest1).toFixed(4))
    : simEntropy(simDigest1).toFixed(4);

  const activeAvalanche = isApiActive
    ? (apiAvalancheVal !== null ? apiAvalancheVal.toFixed(2) : simAvalanche(simDigest1, simDigest2).toFixed(2))
    : simAvalanche(simDigest1, simDigest2).toFixed(2);

  const sha256Sim = simHash("sha256:" + input, 3.99, 12);

  // Bit Matrix rendering
  const activeBits1 = hexToBits(activeDigest);
  const activeBits2 = hexToBits(activeDigest2);
  const activeBitFlipMatrix = isApiActive && apiBitFlipMatrix.length > 0 
    ? apiBitFlipMatrix 
    : activeBits1.map((b1, i) => b1 !== activeBits2[i]);

  const copy = () => {
    navigator.clipboard.writeText(activeDigest);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const tabs = [
    { id: "hash" as const,      label: "Hash",      icon: Lock },
    { id: "avalanche" as const, label: "Avalanche", icon: Zap },
    { id: "entropy" as const,   label: "Entropy",   icon: BarChart3 },
    { id: "hmac" as const,      label: "HMAC-ANCH", icon: Fingerprint },
  ];

  return (
    <section id="playground" className="section" style={{ position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px" }}>
            <Zap size={12} />
            <span>Online Playground</span>
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Try ANCH <span className="gradient-text">Right Now</span>
          </h2>
          <p style={{ color: "var(--anch-text-dim)", maxWidth: 520, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
            Interactive cryptography testing. Tune parameters or connect the backend to witness the real-time neural network parameter generator.
          </p>

          {/* API Server status indicator banner */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "8px 16px", borderRadius: "100px", background: isApiActive ? "rgba(0, 255, 170, 0.08)" : "rgba(255, 107, 53, 0.08)", border: isApiActive ? "1px solid rgba(0, 255, 170, 0.25)" : "1px solid rgba(255, 107, 53, 0.25)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isApiActive ? "var(--anch-green)" : "var(--anch-orange)", display: "inline-block", boxShadow: isApiActive ? "0 0 10px var(--anch-green)" : "none" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", color: isApiActive ? "var(--anch-green)" : "var(--anch-orange)" }}>
              {isApiActive ? "Python API server: Connected (Adaptive Mode Active)" : "Python API server: Offline (Simulator Mode Active)"}
            </span>
          </div>
        </div>

        <div className="glass" style={{ maxWidth: 940, margin: "0 auto", borderRadius: 24, padding: "36px 32px", border: "1px solid rgba(124, 93, 250, 0.25)" }}>
          
          {/* Dashboard Header - Tabs & Sliders */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, borderBottom: "1px solid rgba(124, 93, 250, 0.15)", paddingBottom: 24, marginBottom: 28, flexWrap: "wrap" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, background: "rgba(6, 4, 15, 0.8)", borderRadius: 50, padding: 6, border: "1px solid rgba(124, 93, 250, 0.15)" }}>
              {tabs.map((t) => {
                const TabIcon = t.icon;
                const isSelected = tab === t.id;
                return (
                  <button
                    key={t.id}
                    id={`playground-tab-${t.id}`}
                    onClick={() => setTab(t.id)}
                    style={{
                      background: isSelected ? "linear-gradient(135deg, var(--anch-purple) 0%, var(--anch-purple-dim) 100%)" : "transparent",
                      border: "none",
                      borderRadius: 50, 
                      padding: "8px 20px", 
                      color: isSelected ? "white" : "var(--anch-text-dim)",
                      cursor: "pointer", 
                      fontSize: "0.85rem", 
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isSelected ? "0 4px 15px rgba(124, 93, 250, 0.3)" : "none"
                    }}
                  >
                    <TabIcon size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tuning Panel / Neural Info */}
            {isApiActive ? (
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Cpu size={16} className="float-element" style={{ color: "var(--anch-green)" }} />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--anch-text-dim)" }}>
                  Adaptive parameters derived by Neural Generator W1/W2
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }} className="sliders-container">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Sliders size={14} style={{ color: "var(--anch-purple)" }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--anch-text-dim)", textTransform: "uppercase" }}>Tuning:</span>
                </div>
                
                {/* Slider 1: Chaos R */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: 140 }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 600 }}>Chaos r parameter</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--anch-cyan)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{chaosR.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="3.57" 
                    max="4.00" 
                    step="0.01" 
                    value={chaosR} 
                    onChange={(e) => setChaosR(parseFloat(e.target.value))}
                    style={{ width: 140, accentColor: "var(--anch-cyan)", cursor: "pointer" }}
                  />
                </div>

                {/* Slider 2: Feistel rounds */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: 140 }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 600 }}>Feistel Rounds</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--anch-purple-bright)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{feistelRounds} rounds</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="16" 
                    step="1" 
                    value={feistelRounds} 
                    onChange={(e) => setFeistelRounds(parseInt(e.target.value))}
                    style={{ width: 140, accentColor: "var(--anch-purple)", cursor: "pointer" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hash tab */}
          {tab === "hash" && (
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Input Payload</label>
              <textarea
                id="playground-hash-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="playground-input"
                rows={3}
                placeholder="Enter any text to hash…"
                style={{ marginBottom: 24, fontSize: "1rem" }}
              />
              
              <div className="grid-2" style={{ gap: 20 }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", marginBottom: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <Fingerprint size={14} style={{ color: "var(--anch-cyan)" }} />
                    <span>ANCH {isApiActive ? "Real Python" : "Simulated"} Hash Digest</span>
                  </div>
                  <div className="result-box" style={{ color: "var(--anch-cyan)", wordBreak: "break-all", fontSize: "0.88rem", background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124, 93, 250, 0.2)", minHeight: 74, display: "flex", alignItems: "center" }}>
                    {apiLoading ? (
                      <span style={{ color: "var(--anch-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(0, 240, 255, 0.2)", borderTopColor: "var(--anch-cyan)", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                        Encrypting via Python backend...
                      </span>
                    ) : activeDigest}
                  </div>
                  <button 
                    onClick={copy} 
                    className="btn-secondary"
                    style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, fontSize: "0.78rem", gap: 6 }}
                  >
                    {copied ? <Check size={12} style={{ color: "var(--anch-green)" }} /> : <Copy size={12} />}
                    <span>{copied ? "Copied!" : "Copy Hash"}</span>
                  </button>
                </div>
                
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--anch-text-muted)", marginBottom: 8, fontWeight: 700 }}>SHA-256 (Reference Mock)</div>
                  <div className="result-box" style={{ color: "var(--anch-text-muted)", wordBreak: "break-all", fontSize: "0.88rem", background: "rgba(6, 4, 15, 0.5)", border: "1px solid rgba(124, 93, 250, 0.1)", minHeight: 74, display: "flex", alignItems: "center" }}>
                    {sha256Sim}
                  </div>
                  <div style={{ marginTop: 12, fontSize: "0.72rem", color: "var(--anch-text-muted)", display: "flex", alignItems: "center", gap: 4, height: 35 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--anch-orange)", display: "inline-block" }} />
                    <span>Provided for structural size comparison</span>
                  </div>
                </div>
              </div>

              {/* Neural parameters card if active */}
              {isApiActive && neuralParams && (
                <div style={{ marginTop: 24, padding: 18, background: "rgba(124, 93, 250, 0.05)", border: "1px solid rgba(124, 93, 250, 0.2)", borderRadius: 14 }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--anch-purple-bright)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <Cpu size={14} />
                    <span>Adaptive Neural Parameters Generated (Deterministic to payload)</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }} className="grid-3">
                    <div style={{ fontSize: "0.75rem" }}>
                      <span style={{ color: "var(--anch-text-muted)" }}>Logistic R: </span>
                      <span style={{ color: "var(--anch-green)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{parseFloat(neuralParams.r_value).toFixed(6)}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem" }}>
                      <span style={{ color: "var(--anch-text-muted)" }}>Feistel Rounds: </span>
                      <span style={{ color: "var(--anch-cyan)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{neuralParams.round_count}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem" }}>
                      <span style={{ color: "var(--anch-text-muted)" }}>Chaotic Seed: </span>
                      <span style={{ color: "var(--anch-purple-bright)", fontFamily: "var(--font-mono)", fontWeight: 700, wordBreak: "break-all" }}>{neuralParams.seed.slice(0, 16)}...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Metadata Summary */}
              <div style={{ marginTop: 24, padding: 18, background: "rgba(6, 4, 15, 0.75)", border: "1px solid rgba(124, 93, 250, 0.15)", borderRadius: 14, display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Digest Output Size</div><div style={{ fontWeight: 800, color: "var(--anch-green)", fontSize: "0.95rem" }}>256 bits (32 bytes)</div></div>
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Shannon Entropy</div><div style={{ fontWeight: 800, color: "var(--anch-purple-bright)", fontSize: "0.95rem" }}>{activeEntropy} bits/byte</div></div>
                {timeTakenMs !== null && isApiActive && (
                  <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>API Exec Time</div><div style={{ fontWeight: 800, color: "var(--anch-cyan)", fontSize: "0.95rem" }}>{timeTakenMs.toFixed(4)} ms</div></div>
                )}
                <div><div style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Input Size</div><div style={{ fontWeight: 800, color: "var(--anch-text)", fontSize: "0.95rem" }}>{new TextEncoder().encode(input).length} bytes</div></div>
              </div>
            </div>
          )}

          {/* Avalanche tab */}
          {tab === "avalanche" && (
            <div>
              <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Payload A</label>
                  <input id="playground-av-a" type="text" value={input} onChange={(e) => setInput(e.target.value)} className="playground-input" />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Payload B (Perturbed)</label>
                  <input id="playground-av-b" type="text" value={input2} onChange={(e) => setInput2(e.target.value)} className="playground-input" />
                </div>
              </div>

              {/* Grid Layout: Visual Bit matrix + Percentage */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, alignItems: "center" }} className="avalanche-grid">
                
                {/* Left: 16x16 Bit Flip Grid */}
                <div style={{ background: "rgba(6, 4, 15, 0.7)", border: "1px solid rgba(124,93,250,0.15)", borderRadius: 18, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", marginBottom: 14, fontWeight: 700 }}>256-Bit Cascade Matrix (Flipped vs Constant)</div>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(16, 1fr)", 
                    gap: 4, 
                    maxWidth: 320, 
                    margin: "0 auto" 
                  }}>
                    {activeBitFlipMatrix.map((isFlipped, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: 2,
                          background: isFlipped 
                            ? "linear-gradient(135deg, var(--anch-cyan) 0%, var(--anch-green) 100%)" 
                            : "rgba(124, 93, 250, 0.08)",
                          boxShadow: isFlipped ? "0 0 8px rgba(0, 240, 255, 0.8)" : "none",
                          border: isFlipped ? "1px solid white" : "1px solid rgba(255,255,255,0.02)",
                          transition: "all 0.2s"
                        }}
                        title={`Bit #${idx}: ${isFlipped ? "Flipped" : "Constant"}`}
                      />
                    ))}
                  </div>
                  
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(124, 93, 250, 0.08)", border: "1px solid rgba(255,255,255,0.05)" }} />
                      <span style={{ color: "var(--anch-text-muted)", fontWeight: 600 }}>Unchanged</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--anch-cyan)", boxShadow: "0 0 6px rgba(0,240,255,0.8)" }} />
                      <span style={{ color: "var(--anch-cyan)", fontWeight: 700 }}>Flipped (Avalanche)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Percentage & Progress Bar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124,93,250,0.15)", borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }}>
                      <span style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", fontWeight: 700 }}>Avalanche Ratio</span>
                      <span style={{ fontWeight: 900, fontSize: "2.1rem", color: parseFloat(activeAvalanche) > 40 ? "var(--anch-green)" : "var(--anch-orange)", lineHeight: 1 }}>{activeAvalanche}%</span>
                    </div>
                    
                    {/* Bar */}
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.02)" }}>
                      <div style={{ width: `${activeAvalanche}%`, height: "100%", background: "linear-gradient(90deg, var(--anch-purple), var(--anch-cyan))", borderRadius: 100, transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)" }} />
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>0%</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--anch-green)", fontWeight: 700 }}>Ideal Target: ~50.0%</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>100%</span>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: "0.82rem", color: "var(--anch-text-muted)", lineHeight: 1.6 }}>
                    A single bit flip in the input cascade generates a completely different chaotic schedule. In standard hashing, an avalanche factor close to 50% represents strong mathematical diffusion.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entropy tab */}
          {tab === "entropy" && (
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Input Payload</label>
              <input id="playground-entropy-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} className="playground-input" style={{ marginBottom: 24 }} />

              <div style={{ background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124,93,250,0.15)", borderRadius: 18, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }}>
                  <span style={{ color: "var(--anch-text-dim)", fontSize: "0.85rem", fontWeight: 700 }}>Shannon Entropy Index</span>
                  <span style={{ fontWeight: 900, fontSize: "2.1rem", color: "var(--anch-purple-bright)", lineHeight: 1 }}>{activeEntropy} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--anch-text-muted)" }}>bits/byte</span></span>
                </div>
                
                {/* Bar */}
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.02)" }}>
                  <div style={{ width: `${(parseFloat(activeEntropy) / 8) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--anch-purple), var(--anch-purple-bright))", borderRadius: 100, transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 0 10px rgba(157, 133, 255, 0.4)" }} />
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-text-muted)" }}>0 (Predictable)</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--anch-green)", fontWeight: 700 }}>Perfect Random Ideal: 8.0 bits/byte</span>
                </div>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--anch-text-dim)", lineHeight: 1.7, background: "rgba(124, 93, 250, 0.04)", border: "1px solid rgba(124,93,250,0.12)", padding: 18, borderRadius: 12 }}>
                Higher entropy indicates that digest bytes are uniformly distributed across the output landscape. The chaotic mapping ensures that even simple inputs maps to high-entropy states, which blocks linear cryptanalysis attempts.
              </div>
            </div>
          )}

          {/* HMAC tab */}
          {tab === "hmac" && (
            <div>
              <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Secret Key</label>
                  <input
                    id="playground-hmac-key"
                    type="text"
                    value={hmacKey}
                    onChange={(e) => {
                      setHmacKey(e.target.value);
                      setHmacVerified(null);
                    }}
                    className="playground-input"
                    placeholder="Enter HMAC key…"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Message Payload</label>
                  <input
                    id="playground-hmac-msg"
                    type="text"
                    value={hmacMessage}
                    onChange={(e) => {
                      setHmacMessage(e.target.value);
                      setHmacVerified(null);
                    }}
                    className="playground-input"
                    placeholder="Enter message to sign…"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--anch-text-dim)", marginBottom: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <Fingerprint size={14} style={{ color: "var(--anch-cyan)" }} />
                  <span>Computed HMAC-ANCH MAC (256-bit / 64-char Hex)</span>
                </div>
                <div className="result-box" style={{ color: "var(--anch-cyan)", wordBreak: "break-all", fontSize: "0.88rem", background: "rgba(6, 4, 15, 0.8)", border: "1px solid rgba(124, 93, 250, 0.2)", minHeight: 74, display: "flex", alignItems: "center" }}>
                  {isApiActive ? apiHmac : simHmac(hmacKey, hmacMessage, chaosR, feistelRounds)}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(isApiActive ? apiHmac : simHmac(hmacKey, hmacMessage, chaosR, feistelRounds));
                    setHmacCopied(true);
                    setTimeout(() => setHmacCopied(false), 1500);
                  }}
                  className="btn-secondary"
                  style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, fontSize: "0.78rem", gap: 6 }}
                >
                  {hmacCopied ? <Check size={12} style={{ color: "var(--anch-green)" }} /> : <Copy size={12} />}
                  <span>{hmacCopied ? "Copied!" : "Copy MAC"}</span>
                </button>
              </div>

              {/* Verification card */}
              <div style={{ padding: 24, background: "rgba(6, 4, 15, 0.75)", border: "1px solid rgba(124, 93, 250, 0.15)", borderRadius: 18 }}>
                <label style={{ fontSize: "0.82rem", color: "var(--anch-text-dim)", marginBottom: 8, display: "block", fontWeight: 700 }}>Verify HMAC Digest</label>
                <div style={{ display: "flex", gap: 12 }} className="demo-grid">
                  <input
                    id="playground-hmac-verify-input"
                    type="text"
                    value={hmacVerifyInput}
                    onChange={(e) => setHmacVerifyInput(e.target.value)}
                    className="playground-input"
                    placeholder="Paste MAC to verify…"
                    style={{ flexGrow: 1 }}
                  />
                  <button
                    onClick={handleVerifyHmac}
                    className="btn-primary"
                    style={{ padding: "0 24px", height: 50, borderRadius: 10, fontSize: "0.85rem" }}
                  >
                    Verify
                  </button>
                </div>

                {hmacVerified !== null && (
                  <div style={{ 
                    marginTop: 16, 
                    padding: "12px 18px", 
                    borderRadius: 8, 
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    border: "1px solid",
                    backgroundColor: hmacVerified ? "rgba(0, 255, 170, 0.08)" : "rgba(255, 107, 53, 0.08)",
                    borderColor: hmacVerified ? "rgba(0, 255, 170, 0.3)" : "rgba(255, 107, 53, 0.3)",
                    color: hmacVerified ? "var(--anch-green)" : "var(--anch-orange)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    {hmacVerified ? (
                      <>
                        <Check size={16} />
                        <span>Verification Successful: Signature matches! Authenticity and integrity verified.</span>
                      </>
                    ) : (
                      <>
                        <span>✕</span>
                        <span>Verification Failed: Signature mismatch! The message or key is incorrect.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .avalanche-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .sliders-container {
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
