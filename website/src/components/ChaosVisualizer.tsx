"use client";
import { useEffect, useRef } from "react";

interface ChaosVisualizerProps {
  inputText: string;
}

export default function ChaosVisualizer({ inputText }: ChaosVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 320);

    // Handle resizing
    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.parentElement?.clientWidth || 400;
        height = canvas.height = 320;
      }
    };
    window.addEventListener("resize", handleResize);

    // Derive deterministic parameters from inputText
    let seed = 1337;
    for (let i = 0; i < inputText.length; i++) {
      seed = ((seed << 5) - seed + inputText.charCodeAt(i)) | 0;
    }
    const absSeed = Math.abs(seed);
    const r = 3.6 + (absSeed % 40) / 100; // chaotic regime r ∈ [3.6, 4.0]
    const baseHue = absSeed % 360;

    // Generate logistic map orbit data
    const generateOrbit = (count: number) => {
      const orbit: number[] = [];
      let x = 0.5 + (absSeed % 1000) / 2000; // x0 ∈ (0.5, 1.0)
      if (x >= 1.0) x = 0.5;

      // Burn-in transient suppression
      for (let i = 0; i < 50; i++) {
        x = r * x * (1 - x);
      }

      // Generate points
      for (let i = 0; i < count; i++) {
        x = r * x * (1 - x);
        orbit.push(x);
      }
      return orbit;
    };

    const pointsCount = 180;
    const orbit = generateOrbit(pointsCount);
    let rotationAngle = 0;

    // Main animation loop
    const render = () => {
      ctx.fillStyle = "rgba(5, 4, 15, 0.15)"; // slight fade trails
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.35;

      rotationAngle += 0.005;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationAngle);

      // Draw chaotic connections (neural paths)
      ctx.beginPath();
      for (let i = 0; i < pointsCount; i++) {
        const val = orbit[i];
        const angle = (i / pointsCount) * Math.PI * 2;
        
        // Map x value to radius variance
        const radius = baseRadius + (val - 0.5) * baseRadius * 0.8;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Add chaotic curves
          const prevVal = orbit[i - 1];
          const prevAngle = ((i - 1) / pointsCount) * Math.PI * 2;
          const prevRadius = baseRadius + (prevVal - 0.5) * baseRadius * 0.8;
          const cpX = (prevRadius + radius) * 0.5 * Math.cos((prevAngle + angle) * 0.5) * 1.1;
          const cpY = (prevRadius + radius) * 0.5 * Math.sin((prevAngle + angle) * 0.5) * 1.1;
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      }
      ctx.closePath();

      // Dynamic glowing gradient line
      const gradient = ctx.createRadialGradient(0, 0, baseRadius * 0.2, 0, 0, baseRadius * 1.3);
      gradient.addColorStop(0, `hsla(${baseHue}, 90%, 65%, 0.15)`);
      gradient.addColorStop(0.5, `hsla(${(baseHue + 60) % 360}, 90%, 55%, 0.8)`);
      gradient.addColorStop(1, `hsla(${(baseHue + 180) % 360}, 100%, 50%, 0.0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${baseHue}, 100%, 60%, 0.6)`;
      ctx.stroke();

      // Draw orbit node points
      for (let i = 0; i < pointsCount; i += 6) {
        const val = orbit[i];
        const angle = (i / pointsCount) * Math.PI * 2;
        const radius = baseRadius + (val - 0.5) * baseRadius * 0.8;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 3 + val * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(baseHue + i * 2) % 360}, 100%, 70%, 0.9)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${(baseHue + i * 2) % 360}, 100%, 60%, 0.8)`;
        ctx.fill();
      }

      ctx.restore();

      // Draw a subtle digital radar interface grid overlay
      ctx.strokeStyle = "rgba(139, 109, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, baseRadius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - baseRadius * 1.2, centerY);
      ctx.lineTo(centerX + baseRadius * 1.2, centerY);
      ctx.moveTo(centerX, centerY - baseRadius * 1.2);
      ctx.lineTo(centerX, centerY + baseRadius * 1.2);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [inputText]);

  return (
    <div style={{ position: "relative", width: "100%", height: 320, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", background: "rgba(5, 4, 15, 0.4)", borderRadius: 12, border: "1px solid var(--anch-border)" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div style={{ position: "absolute", top: 12, left: 16, fontSize: "0.68rem", color: "var(--anch-text-muted)", fontFamily: "var(--font-mono)", pointerEvents: "none", display: "flex", flexDirection: "column", gap: 2 }}>
        <span>CHAOTIC ATTRACTOR ENGINE</span>
        <span>SEED: {Math.abs(inputText.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 1337))}</span>
      </div>
      <div style={{ position: "absolute", bottom: 12, right: 16, fontSize: "0.68rem", color: "var(--anch-text-muted)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>
        LOGISTIC REGIME x[n+1] = r*x*(1-x)
      </div>
    </div>
  );
}
