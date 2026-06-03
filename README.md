# ANCH — Adaptive Neural Chaotic Hash Framework

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue?style=flat-square" alt="version">
  <img src="https://img.shields.io/badge/python-3.12+-green?style=flat-square" alt="python">
  <img src="https://img.shields.io/badge/license-MIT-orange?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/status-experimental-red?style=flat-square" alt="status">
  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square" alt="deps">
</p>

> **ANCH** is an experimental adaptive hashing framework that combines Feature Extraction, Neural Parameter Generation, Chaos Theory, Dynamic Permutation, and a Compression Engine to produce unique 256-bit digests.

---

## ⚠️ Disclaimer

ANCH is an **experimental research framework**. It is **not** intended as a drop-in replacement for SHA-256 or other production cryptographic hash functions. Use it for research, benchmarking, education, and data fingerprinting experiments.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🧠 **Neural Parameter Generation** | Feature-derived parameters control every hash operation |
| 🌀 **Chaos Theory Engine** | Logistic map produces chaotic byte streams for mixing |
| 🔀 **Dynamic Permutation** | Bit and word-level shuffling for avalanche diffusion |
| 🗜️ **Compression Engine** | Multi-round Feistel-style compression |
| 📊 **Built-in Benchmarks** | Avalanche, entropy, collision, and runtime analysis |
| 🖥️ **CLI Interface** | Full command-line access to all features |
| 0️⃣ **Zero Dependencies** | Pure Python 3.12, no external packages required |

---

## 🚀 Installation

```bash
pip install anch-hash
```

Or install from source:

```bash
git clone https://github.com/anch-framework/anch
cd anch
pip install -e ".[dev]"
```

---

## 🔧 Quick Start

```python
import anch

# Hash a string
digest = anch.hash("hello world")
print(digest)  # → 64-character hex string

# Verify a digest
anch.verify("hello world", digest)  # → True

# Hash a file
digest = anch.hash_file("report.pdf")

# Verify a file
anch.verify_file("report.pdf", digest)  # → True

# Avalanche effect analysis
pct = anch.avalanche("hello", "HELLO")
print(f"{pct:.2f}% bits differ")

# Entropy of digest
score = anch.entropy(digest)
print(f"{score:.4f} bits/byte")

# Collision testing
report = anch.collision_test(["user_1", "user_2", "user_3"])
print(report["collisions"])  # → 0
```

---

## 🖥️ CLI Usage

```bash
# Hash a string
anch hash "hello world"

# Hash a file
anch hash-file report.pdf

# Verify
anch verify "hello world" <digest>
anch verify-file report.pdf <digest>

# Analysis
anch avalanche "hello" "HELLO"
anch entropy <digest>

# Benchmarks
anch benchmark --samples 200
```

---

## 🏗️ Architecture

```
Input Data
    ↓
Feature Extractor        → bit count, entropy, byte frequency, bigrams
    ↓
Neural Parameter Gen     → seed, r-value, rotations, compression key
    ↓
Chaotic Engine           → logistic map → chaos byte stream
    ↓
Dynamic Permutation      → bit shuffle + word rotation
    ↓
Compression Engine       → multi-round Feistel mixing + folding
    ↓
ANCH Digest (256-bit)
```

---

## 📦 Package Structure

```
ANCH/
├── src/anch/
│   ├── __init__.py        # Public API
│   ├── __main__.py        # CLI entry point
│   ├── core.py            # Pipeline orchestrator
│   ├── feature.py         # Feature extraction
│   ├── neural.py          # Neural parameter generation
│   ├── chaos.py           # Chaotic engine
│   ├── permutation.py     # Dynamic permutation
│   ├── compression.py     # Compression engine
│   └── benchmark.py       # Benchmark suite
├── tests/
│   ├── test_core.py       # Public API tests
│   └── test_modules.py    # Internal module tests
├── examples/
│   └── demo.py            # Quick demo
├── docs/                  # MkDocs documentation
├── website/               # Next.js website
├── pyproject.toml
└── README.md
```

---

## 📊 Benchmark Suite

```python
from anch.benchmark import BenchmarkSuite

suite = BenchmarkSuite(samples=200)
report = suite.run_all()
suite.print_report(report)
```

Benchmarks include:
- **Avalanche Effect** — target ≈ 50% bit change per single-bit input flip
- **Digest Entropy** — target ≈ 8.0 bits/byte
- **Collision Resistance** — zero collisions expected across random dataset
- **Runtime Performance** — throughput across 16B–64KB inputs
- **SHA-256 Comparison** — relative speed comparison

---

## 🗺️ Roadmap

| Version | Features |
|---------|----------|
| **v0.1** ✅ | Core Hash Engine, Python SDK, CLI, Tests |
| **v0.2** | Benchmark Suite UI, Online Playground, REST API |
| **v0.3** | Multi-Chaotic Engine (Tent, Hénon), TF Integration, Dynamic S-Box |
| **v1.0** | Full Public Release, Developer SDK, Community |

---

## 📄 License

MIT © ANCH Framework Team

---

## 🌐 Links

- **Website**: [anch-framework.vercel.app](https://anch-framework.vercel.app)
- **Documentation**: [anch-framework.vercel.app/docs](https://anch-framework.vercel.app/docs)
- **PyPI**: [pypi.org/project/anch-hash](https://pypi.org/project/anch-hash)
