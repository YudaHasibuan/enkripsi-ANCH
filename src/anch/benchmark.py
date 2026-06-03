"""
ANCH Benchmark Suite
=====================
Responsible for:
  - Avalanche effect testing over large sample sets
  - Entropy distribution testing
  - Collision resistance testing
  - Runtime / throughput benchmarking
  - SHA-256 comparison benchmarks

Usage:
    from anch.benchmark import BenchmarkSuite
    suite = BenchmarkSuite()
    report = suite.run_all()
    suite.print_report(report)
"""

import time
import hashlib
import random
import string
import statistics
from typing import Union

import anch


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _random_string(length: int) -> str:
    """Generate a random ASCII string of the given length."""
    return "".join(random.choices(string.printable, k=length))


def _flip_one_bit(data: bytes, bit_pos: int) -> bytes:
    """Flip a single bit in a bytes object."""
    byte_pos = bit_pos // 8
    bit_offset = 7 - (bit_pos % 8)
    arr = bytearray(data)
    arr[byte_pos] ^= 1 << bit_offset
    return bytes(arr)


# ---------------------------------------------------------------------------
# BenchmarkSuite
# ---------------------------------------------------------------------------

class BenchmarkSuite:
    """
    Comprehensive benchmark suite for the ANCH framework.

    Attributes:
        samples:    Number of test samples per benchmark.
        seed:       Random seed for reproducibility.
    """

    def __init__(self, samples: int = 100, seed: int = 42) -> None:
        self.samples = samples
        self.seed = seed
        random.seed(seed)

    # ------------------------------------------------------------------
    # Individual benchmarks
    # ------------------------------------------------------------------

    def benchmark_avalanche(self) -> dict:
        """
        Measure the avalanche effect by flipping one bit in random inputs
        and computing the percentage of output bits that change.

        Returns:
            dict with mean, std_dev, min, max avalanche percentages.
        """
        results = []
        for _ in range(self.samples):
            length = random.randint(4, 128)
            original = _random_string(length).encode()
            bit_pos = random.randint(0, len(original) * 8 - 1)
            flipped = _flip_one_bit(original, bit_pos)

            pct = anch.avalanche(original, flipped)
            results.append(pct)

        return {
            "name": "Avalanche Effect",
            "samples": self.samples,
            "mean": round(statistics.mean(results), 4),
            "std_dev": round(statistics.stdev(results) if len(results) > 1 else 0.0, 4),
            "min": round(min(results), 4),
            "max": round(max(results), 4),
            "ideal": 50.0,
            "unit": "%",
            "raw": results,
        }

    def benchmark_entropy(self) -> dict:
        """
        Measure the Shannon entropy of ANCH digests over random inputs.

        Returns:
            dict with mean, std_dev, min, max entropy scores.
        """
        results = []
        for _ in range(self.samples):
            data = _random_string(random.randint(1, 512))
            digest = anch.hash(data)
            score = anch.entropy(digest)
            results.append(score)

        return {
            "name": "Digest Entropy",
            "samples": self.samples,
            "mean": round(statistics.mean(results), 6),
            "std_dev": round(statistics.stdev(results) if len(results) > 1 else 0.0, 6),
            "min": round(min(results), 6),
            "max": round(max(results), 6),
            "ideal": 8.0,
            "unit": "bits/byte",
            "raw": results,
        }

    def benchmark_collisions(self) -> dict:
        """
        Test collision resistance using a dataset of random strings.

        Returns:
            Collision report from anch.collision_test().
        """
        dataset = [_random_string(random.randint(4, 128)) for _ in range(self.samples)]
        report = anch.collision_test(dataset)
        return {
            "name": "Collision Resistance",
            **report,
        }

    def benchmark_runtime(self) -> dict:
        """
        Measure ANCH hashing throughput for various input sizes.

        Returns:
            dict mapping input sizes to timing metrics.
        """
        sizes = [16, 64, 256, 1024, 4096, 16384, 65536]
        results = {}

        for size in sizes:
            data = _random_string(size).encode()
            times = []
            for _ in range(max(5, self.samples // 10)):
                t0 = time.perf_counter()
                anch.hash(data)
                t1 = time.perf_counter()
                times.append((t1 - t0) * 1000)  # ms

            results[size] = {
                "input_bytes": size,
                "mean_ms": round(statistics.mean(times), 4),
                "min_ms": round(min(times), 4),
                "max_ms": round(max(times), 4),
                "throughput_kbps": round(size / (statistics.mean(times) / 1000) / 1024, 2),
            }

        return {
            "name": "Runtime Performance",
            "sizes": results,
        }

    def benchmark_sha256_comparison(self) -> dict:
        """
        Compare ANCH runtime against SHA-256 for the same inputs.

        Returns:
            dict with per-size comparison of ANCH vs SHA-256 timing.
        """
        sizes = [64, 1024, 65536]
        comparison = {}

        for size in sizes:
            data = _random_string(size).encode()
            iterations = max(5, self.samples // 10)

            # ANCH timing
            anch_times = []
            for _ in range(iterations):
                t0 = time.perf_counter()
                anch.hash(data)
                anch_times.append((time.perf_counter() - t0) * 1000)

            # SHA-256 timing
            sha_times = []
            for _ in range(iterations):
                t0 = time.perf_counter()
                hashlib.sha256(data).hexdigest()
                sha_times.append((time.perf_counter() - t0) * 1000)

            anch_mean = statistics.mean(anch_times)
            sha_mean = statistics.mean(sha_times)

            comparison[size] = {
                "input_bytes": size,
                "anch_mean_ms": round(anch_mean, 4),
                "sha256_mean_ms": round(sha_mean, 4),
                "ratio": round(anch_mean / sha_mean, 2) if sha_mean > 0 else float("inf"),
            }

        return {
            "name": "SHA-256 Comparison",
            "comparison": comparison,
        }

    # ------------------------------------------------------------------
    # Run all benchmarks
    # ------------------------------------------------------------------

    def run_all(self) -> dict:
        """
        Run the complete benchmark suite.

        Returns:
            dict with all benchmark results.
        """
        return {
            "avalanche": self.benchmark_avalanche(),
            "entropy": self.benchmark_entropy(),
            "collisions": self.benchmark_collisions(),
            "runtime": self.benchmark_runtime(),
            "sha256_comparison": self.benchmark_sha256_comparison(),
        }

    # ------------------------------------------------------------------
    # Reporting
    # ------------------------------------------------------------------

    def print_report(self, report: dict) -> None:
        """
        Pretty-print a benchmark report to stdout.

        Args:
            report: Result dict from run_all().
        """
        width = 60
        sep = "─" * width

        print(f"\n{'═' * width}")
        print(f"  ANCH Benchmark Report")
        print(f"{'═' * width}")

        # Avalanche
        av = report["avalanche"]
        print(f"\n{sep}")
        print(f"  {av['name']}")
        print(f"{sep}")
        print(f"  Samples:  {av['samples']}")
        print(f"  Mean:     {av['mean']} {av['unit']}  (ideal ≈ {av['ideal']})")
        print(f"  Std Dev:  {av['std_dev']} {av['unit']}")
        print(f"  Range:    [{av['min']} – {av['max']}] {av['unit']}")

        # Entropy
        en = report["entropy"]
        print(f"\n{sep}")
        print(f"  {en['name']}")
        print(f"{sep}")
        print(f"  Samples:  {en['samples']}")
        print(f"  Mean:     {en['mean']} {en['unit']}  (ideal ≈ {en['ideal']})")
        print(f"  Std Dev:  {en['std_dev']} {en['unit']}")
        print(f"  Range:    [{en['min']} – {en['max']}] {en['unit']}")

        # Collisions
        col = report["collisions"]
        print(f"\n{sep}")
        print(f"  {col['name']}")
        print(f"{sep}")
        print(f"  Tested:      {col['total']}")
        print(f"  Unique:      {col['unique_digests']}")
        print(f"  Collisions:  {col['collisions']} ({col['collision_rate']}%)")

        # Runtime
        rt = report["runtime"]
        print(f"\n{sep}")
        print(f"  {rt['name']}")
        print(f"{sep}")
        print(f"  {'Input':>10}  {'Mean ms':>10}  {'Throughput':>16}")
        for size, data in rt["sizes"].items():
            print(
                f"  {data['input_bytes']:>10} B"
                f"  {data['mean_ms']:>10.4f} ms"
                f"  {data['throughput_kbps']:>12.2f} KB/s"
            )

        # SHA-256 comparison
        cmp = report["sha256_comparison"]
        print(f"\n{sep}")
        print(f"  {cmp['name']}")
        print(f"{sep}")
        print(f"  {'Input':>10}  {'ANCH ms':>10}  {'SHA256 ms':>10}  {'Ratio':>8}")
        for size, data in cmp["comparison"].items():
            print(
                f"  {data['input_bytes']:>10} B"
                f"  {data['anch_mean_ms']:>10.4f}"
                f"  {data['sha256_mean_ms']:>10.4f}"
                f"  {data['ratio']:>7.2f}×"
            )

        print(f"\n{'═' * width}\n")
