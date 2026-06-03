"""
ANCH Neural Parameter Generator
================================
Responsible for:
  - Converting feature vectors into hash-controlling parameters
  - Seed generation for the chaotic engine
  - Rotation schedule generation
  - Compression key generation

The "neural" layer is a lightweight, dependency-free pseudo-neural
transform: a fixed-weight, multi-layer linear projection followed by
a sigmoid-like activation.  No external ML library is required.
All weights are derived deterministically from the feature vector
itself so the mapping is reproducible.
"""

import math
import struct
from typing import Sequence


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _sigmoid(x: float) -> float:
    """Numerically stable sigmoid activation."""
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    else:
        ex = math.exp(x)
        return ex / (1.0 + ex)


def _tanh(x: float) -> float:
    """Standard tanh activation bounded to [-1, 1]."""
    return math.tanh(max(-500.0, min(500.0, x)))


def _dot(a: Sequence[float], b: Sequence[float]) -> float:
    """Dot product of two equal-length sequences."""
    return sum(ai * bi for ai, bi in zip(a, b))


def _derive_weights(seed_int: int, rows: int, cols: int) -> list[list[float]]:
    """
    Deterministically derive a weight matrix from an integer seed.

    Uses a linear congruential generator (LCG) to fill the matrix so
    there are no external dependencies.  The weights are normalized to
    keep activations in a reasonable range.
    """
    a, c, m = 1664525, 1013904223, 2**32
    state = seed_int % m
    matrix: list[list[float]] = []
    for _ in range(rows):
        row: list[float] = []
        for _ in range(cols):
            state = (a * state + c) % m
            # Map [0, m) → [-1, 1]
            row.append((state / m) * 2.0 - 1.0)
        matrix.append(row)
    return matrix


def _forward(
    vector: list[float],
    weight_matrix: list[list[float]],
    activation: str = "sigmoid",
) -> list[float]:
    """
    One dense layer forward pass: output[i] = act(dot(W[i], vector)).
    """
    act = _sigmoid if activation == "sigmoid" else _tanh
    return [act(_dot(row, vector)) for row in weight_matrix]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_parameters(feature_vector: list[float]) -> dict:
    """
    Transform a feature vector into hash-controlling neural parameters.

    The pipeline:
      1. Derive a primary seed from the feature vector.
      2. Run two dense hidden layers (sigmoid activation).
      3. Decode output neurons into named parameters.

    Args:
        feature_vector: Normalized float vector (from feature.build_feature_vector).

    Returns:
        dict with keys:
          - seed (int 64-bit):      primary chaotic map seed
          - r_value (float):        logistic map r-parameter ∈ [3.57, 4.0]
          - rotations (list[int]):  8 bit-rotation amounts ∈ [1, 63]
          - compression_key (int):  64-bit compression round key
          - round_count (int):      number of compression rounds ∈ [4, 16]
          - permutation_seed (int): seed for the permutation engine
    """
    vec = feature_vector

    # ------------------------------------------------------------------
    # Step 1 — primary seed from raw vector checksum
    # ------------------------------------------------------------------
    raw_seed = 0
    for i, v in enumerate(vec):
        bits = struct.unpack(">Q", struct.pack(">d", v))[0]
        raw_seed ^= bits * (i + 1)
    raw_seed = raw_seed & 0xFFFFFFFFFFFFFFFF  # keep 64 bits

    # ------------------------------------------------------------------
    # Step 2 — Layer 1 (134 → 32), layer 2 (32 → 16)
    # ------------------------------------------------------------------
    W1 = _derive_weights(raw_seed & 0xFFFFFFFF, rows=32, cols=len(vec))
    h1 = _forward(vec, W1, activation="sigmoid")

    W2 = _derive_weights((raw_seed >> 32) & 0xFFFFFFFF, rows=16, cols=32)
    h2 = _forward(h1, W2, activation="tanh")

    # ------------------------------------------------------------------
    # Step 3 — Decode output neurons into parameters
    # ------------------------------------------------------------------

    # Seed: combine first 8 outputs into a 64-bit integer
    seed = 0
    for i in range(8):
        byte_val = int(abs(h2[i]) * 255) & 0xFF
        seed = (seed << 8) | byte_val

    # r-value for logistic map: must be in chaotic regime [3.57, 4.0]
    r_value = 3.57 + (abs(h2[8]) * 0.43)

    # Rotation schedule: 8 values in [1, 63]
    rotations = []
    for i in range(8):
        rot = int(abs(h2[i % 16]) * 62) + 1
        rotations.append(rot % 64 or 1)

    # Compression key
    compression_key = 0
    for i in range(8):
        byte_val = int(abs(h1[i]) * 255) & 0xFF
        compression_key = (compression_key << 8) | byte_val

    # Round count: 4–16 based on neuron 9
    round_count = 4 + int(abs(h2[9]) * 12)

    # Permutation seed
    permutation_seed = 0
    for i in range(4):
        byte_val = int(abs(h1[8 + i]) * 255) & 0xFF
        permutation_seed = (permutation_seed << 8) | byte_val

    return {
        "seed": seed,
        "r_value": r_value,
        "rotations": rotations,
        "compression_key": compression_key,
        "round_count": round_count,
        "permutation_seed": permutation_seed,
    }
