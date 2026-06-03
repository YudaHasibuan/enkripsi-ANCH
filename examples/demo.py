"""
ANCH Examples
=============
Demonstrates the ANCH framework's public API.
"""

import anch
from anch.benchmark import BenchmarkSuite

print("=" * 60)
print("  ANCH Framework — Quick Demo")
print("=" * 60)

# ── 1. Basic Hashing ───────────────────────────────────────────
print("\n[1] Basic Hashing")
digest = anch.hash("hello world")
print(f"    anch.hash('hello world')")
print(f"    → {digest}")

# ── 2. Determinism ────────────────────────────────────────────
print("\n[2] Determinism Check")
d1 = anch.hash("hello")
d2 = anch.hash("hello")
print(f"    Same input, same output: {d1 == d2}")

# ── 3. Verify ─────────────────────────────────────────────────
print("\n[3] Verification")
digest = anch.hash("secure payload")
valid = anch.verify("secure payload", digest)
invalid = anch.verify("tampered payload", digest)
print(f"    Correct data → valid: {valid}")
print(f"    Tampered data → valid: {invalid}")

# ── 4. File Hashing ──────────────────────────────────────────
import tempfile, os

print("\n[4] File Hashing")
with tempfile.NamedTemporaryFile(delete=False, suffix=".txt", mode="wb") as f:
    f.write(b"ANCH file hashing demonstration content")
    tmp_path = f.name

file_digest = anch.hash_file(tmp_path)
print(f"    anch.hash_file('{os.path.basename(tmp_path)}')")
print(f"    → {file_digest}")
print(f"    Verified: {anch.verify_file(tmp_path, file_digest)}")
os.unlink(tmp_path)

# ── 5. Avalanche Effect ───────────────────────────────────────
print("\n[5] Avalanche Effect")
pairs = [
    ("hello", "HELLO"),
    ("hello", "hello "),
    ("abc", "abd"),
]
for a, b in pairs:
    pct = anch.avalanche(a, b)
    print(f"    {a!r} vs {b!r}  →  {pct:.2f}% bits differ")

# ── 6. Entropy Analysis ───────────────────────────────────────
print("\n[6] Entropy Analysis")
for text in ["hello", "hello world", "x" * 100, "ANCH framework test 2025"]:
    digest = anch.hash(text)
    score = anch.entropy(digest)
    print(f"    {text!r[:30]:30s}  entropy={score:.4f} bits/byte")

# ── 7. Collision Testing ──────────────────────────────────────
print("\n[7] Collision Testing")
dataset = [f"user_{i}@example.com" for i in range(50)]
report = anch.collision_test(dataset)
print(f"    Tested {report['total']} inputs")
print(f"    Unique digests: {report['unique_digests']}")
print(f"    Collisions: {report['collisions']} ({report['collision_rate']}%)")

print("\n" + "=" * 60)
print("  Done! Use BenchmarkSuite for full performance analysis.")
print("=" * 60)
