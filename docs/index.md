# ANCH Framework Documentation

Welcome to the official documentation for the **ANCH (Adaptive Neural Chaotic Hash) Framework**.

ANCH is an experimental, dependency-free Python hashing framework combining Feature Extraction, Pseudo-Neural Parameter Generation, Chaos Theory, Dynamic Permutation, and a Feistel-based Compression Engine.

!!! warning "Academic & Research Disclaimer"
    ANCH is a **research and experimental framework**. It is **not** designed to replace cryptographically secure, industry-standard hash algorithms like SHA-256 or SHA-3 in production environments. Use it for academic study, chaotic map exploration, dataset benchmarking, and custom data fingerprinting.

---

## Key Design Principles

*   **Adaptability**: Operation parameters (round counts, chaotic map parameters, rotation values) are deterministically generated from the features of the input data itself via a lightweight linear projection.
*   **Chaotic Diffusion**: Utilizes the chaotic regime of Logistic, Tent, and Hénon maps to generate highly sensitive, non-linear pseudo-random streams.
*   **Zero Dependencies**: The core Python package requires no external mathematical or machine learning libraries (though NumPy acceleration is supported optionally for high-performance use cases).

---

## Architecture Flow

The hashing pipeline executes in five distinct phases:

```
  Data Input (Bytes)
         │
         ▼
 1. Feature Extractor ─────────► Extracts Hamming weight, entropy, bigrams, mean, variance
         │
         ▼
 2. Neural Parameter Gen ──────► Deterministic linear projection W1/W2 to parameters
         │
         ▼
 3. Chaotic Map Engine ────────► Generates chaotic stream (Logistic / Tent / Hénon)
         │
         ▼
 4. Dynamic Permutation ───────► Shuffles state bits using chaotic stream and rotations
         │
         ▼
 5. Feistel Compression ───────► Multi-round Feistel compression to 256-bit Digest
```

---

## Navigating the Docs

To get started, explore:

*   [Installation](installation.md): How to set up ANCH on your local environment.
*   [Quick Start](quickstart.md): Basic code examples for hashing, verification, and benchmarking.
*   [API Reference](api/overview.md): Technical description of all public SDK functions.
*   [Architecture](architecture.md): Deep dive into the internal modules (features, neural, chaos, permutation, compression).
*   [Benchmarks](benchmarks.md): Detailed comparison against SHA-256 and entropy diagnostics.
