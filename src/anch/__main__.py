"""
ANCH CLI Entry Point
====================
Provides a simple command-line interface for the ANCH framework.

Usage:
    anch hash "hello world"
    anch hash-file report.pdf
    anch verify "hello world" <digest>
    anch avalanche "hello" "HELLO"
    anch entropy <digest>
    anch benchmark [--samples N]
"""

import argparse
import sys
import os

import anch
from anch.benchmark import BenchmarkSuite


def cmd_hash(args):
    result = anch.hash(args.data)
    print(result)


def cmd_hash_file(args):
    result = anch.hash_file(args.filepath)
    print(result)


def cmd_verify(args):
    ok = anch.verify(args.data, args.digest)
    if ok:
        print("✓ Digest VALID")
        sys.exit(0)
    else:
        print("✗ Digest INVALID")
        sys.exit(1)


def cmd_verify_file(args):
    ok = anch.verify_file(args.filepath, args.digest)
    if ok:
        print("✓ File digest VALID")
        sys.exit(0)
    else:
        print("✗ File digest INVALID")
        sys.exit(1)


def cmd_avalanche(args):
    pct = anch.avalanche(args.a, args.b)
    print(f"Avalanche Effect: {pct:.4f}%")


def cmd_entropy(args):
    score = anch.entropy(args.digest)
    print(f"Entropy: {score:.6f} bits/byte  (ideal: 8.0)")


def cmd_benchmark(args):
    suite = BenchmarkSuite(samples=args.samples)
    print(f"Running ANCH benchmark suite ({args.samples} samples)...")
    report = suite.run_all()
    suite.print_report(report)


def main():
    parser = argparse.ArgumentParser(
        prog="anch",
        description="ANCH — Adaptive Neural Chaotic Hash Framework",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  anch hash "hello world"
  anch hash-file report.pdf
  anch verify "hello world" 7f91ac...
  anch avalanche "hello" "HELLO"
  anch entropy 7f91ac...
  anch benchmark --samples 50
        """,
    )
    parser.add_argument("--version", action="version", version=f"anch {anch.__version__}")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # hash
    p_hash = subparsers.add_parser("hash", help="Hash a string")
    p_hash.add_argument("data", help="Input string to hash")
    p_hash.set_defaults(func=cmd_hash)

    # hash-file
    p_hf = subparsers.add_parser("hash-file", help="Hash a file")
    p_hf.add_argument("filepath", help="Path to file")
    p_hf.set_defaults(func=cmd_hash_file)

    # verify
    p_verify = subparsers.add_parser("verify", help="Verify a string digest")
    p_verify.add_argument("data", help="Input data")
    p_verify.add_argument("digest", help="Expected ANCH digest")
    p_verify.set_defaults(func=cmd_verify)

    # verify-file
    p_vf = subparsers.add_parser("verify-file", help="Verify a file digest")
    p_vf.add_argument("filepath", help="Path to file")
    p_vf.add_argument("digest", help="Expected ANCH digest")
    p_vf.set_defaults(func=cmd_verify_file)

    # avalanche
    p_av = subparsers.add_parser("avalanche", help="Measure avalanche effect")
    p_av.add_argument("a", help="First input")
    p_av.add_argument("b", help="Second input")
    p_av.set_defaults(func=cmd_avalanche)

    # entropy
    p_en = subparsers.add_parser("entropy", help="Compute digest entropy")
    p_en.add_argument("digest", help="Hex digest to analyze")
    p_en.set_defaults(func=cmd_entropy)

    # benchmark
    p_bm = subparsers.add_parser("benchmark", help="Run benchmark suite")
    p_bm.add_argument("--samples", type=int, default=100, help="Number of samples (default: 100)")
    p_bm.set_defaults(func=cmd_benchmark)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
