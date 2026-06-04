"""
ANCH Feature Extractor
======================
Responsible for:
  - Bit extraction from raw input data
  - Entropy calculation of input
  - Feature vector generation for the neural parameter generator

The feature extractor converts raw input bytes into a normalized
numerical vector that encodes structural and statistical properties
of the data.
"""

import struct
import math
from typing import Union

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False


def extract_features(data: bytes) -> dict:
    """
    Extract a rich feature vector from raw input bytes.

    Args:
        data: Raw input bytes to analyze.

    Returns:
        A dictionary containing:
          - length: original byte length
          - bit_count: total number of set bits (Hamming weight)
          - byte_freq: normalized byte frequency vector (256 floats)
          - entropy: Shannon entropy of the byte distribution
          - checksum: XOR checksum of all bytes
          - mean: arithmetic mean of byte values
          - variance: variance of byte values
          - ngram_hash: bigram frequency hash (compact 64-element vector)

    Examples:
        >>> feats = extract_features(b"hello")
        >>> 0.0 <= feats["entropy"] <= 8.0
        True
    """
    if not data:
        # Return a zero-feature vector for empty input
        return {
            "length": 0,
            "bit_count": 0,
            "byte_freq": [0.0] * 256,
            "entropy": 0.0,
            "checksum": 0,
            "mean": 0.0,
            "variance": 0.0,
            "ngram_hash": [0.0] * 64,
        }

    n = len(data)

    if HAS_NUMPY:
        arr = np.frombuffer(data, dtype=np.uint8)
        
        # 1. Hamming Weight (bit count) via numpy bit operations
        bit_count = int(np.unpackbits(arr).sum())

        # 2. Byte frequency distribution
        freq, _ = np.histogram(arr, bins=np.arange(257))
        byte_freq = [float(f) / n for f in freq]

        # 3. Shannon entropy
        entropy_val = 0.0
        for f in byte_freq:
            if f > 0.0:
                entropy_val -= f * math.log2(f)

        # 4. Checksum (XOR fold)
        checksum = int(np.bitwise_xor.reduce(arr))

        # 5. Mean and variance of byte values
        mean = sum(data) / n
        var_sum = 0.0
        for b in data:
            var_sum += (float(b) - mean) ** 2
        variance = var_sum / n

        # 6. Bigram frequency hash
        ngram_hash = [0.0] * 64
        if n > 1:
            pairs = (arr[:-1].astype(np.uint16) << 8) | arr[1:]
            buckets = pairs % 64
            bucket_counts = np.bincount(buckets, minlength=64)[:64]
            max_ngram = int(bucket_counts.max()) or 1
            ngram_hash = [float(c) / max_ngram for c in bucket_counts]
    else:
        # -----------------------------------------------------------------
        # Fallback Pure Python (Zero Dependencies)
        # -----------------------------------------------------------------
        # Bit extraction — Hamming weight
        bit_count = sum(bin(b).count("1") for b in data)

        # Byte frequency distribution
        freq = [0] * 256
        for b in data:
            freq[b] += 1
        byte_freq = [f / n for f in freq]

        # Shannon entropy
        entropy_val = 0.0
        for f in byte_freq:
            if f > 0.0:
                entropy_val -= f * math.log2(f)

        # Checksum (XOR fold)
        checksum = 0
        for b in data:
            checksum ^= b

        # Mean and variance of byte values
        mean = sum(data) / n
        var_sum = 0.0
        for b in data:
            var_sum += (float(b) - mean) ** 2
        variance = var_sum / n

        # Bigram frequency hash — compact 64-element vector
        ngram_hash = [0.0] * 64
        if n > 1:
            for i in range(n - 1):
                pair_val = (data[i] << 8) | data[i + 1]
                bucket = pair_val % 64
                ngram_hash[bucket] += 1.0
            max_ngram = max(ngram_hash) or 1.0
            ngram_hash = [v / max_ngram for v in ngram_hash]

    return {
        "length": n,
        "bit_count": bit_count,
        "byte_freq": byte_freq,
        "entropy": entropy_val,
        "checksum": checksum,
        "mean": mean,
        "variance": variance,
        "ngram_hash": ngram_hash,
    }


def build_feature_vector(features: dict) -> list[float]:
    """
    Flatten the feature dictionary into a single normalized float vector.

    The vector layout:
      [0]       length (log-normalized)
      [1]       bit_count (normalized by 8*length)
      [2]       entropy (normalized by 8.0)
      [3]       checksum (normalized by 255)
      [4]       mean (normalized by 255)
      [5]       variance (normalized by 255^2)
      [6..69]   byte_freq (256 values, downsampled to 64 buckets)
      [70..133] ngram_hash (64 values)

    Total vector length: 134 floats.
    """
    n = features["length"]

    # Scalar features
    length_norm = math.log1p(n) / math.log1p(1_000_000)
    bit_norm = features["bit_count"] / (8 * n) if n > 0 else 0.0
    entropy_norm = features["entropy"] / 8.0
    checksum_norm = features["checksum"] / 255.0
    mean_norm = features["mean"] / 255.0
    variance_norm = features["variance"] / (255.0 ** 2)

    # Downsample byte_freq 256 → 64 (sum groups of 4)
    bf = features["byte_freq"]
    bf64 = [bf[i * 4] + bf[i * 4 + 1] + bf[i * 4 + 2] + bf[i * 4 + 3] for i in range(64)]

    vector = (
        [length_norm, bit_norm, entropy_norm, checksum_norm, mean_norm, variance_norm]
        + bf64
        + features["ngram_hash"]
    )
    return [0.0 if x == 0.0 else x for x in vector]


def compute_input_entropy(data: bytes) -> float:
    """
    Convenience function: compute Shannon entropy directly from bytes.

    Returns entropy in bits (0.0 – 8.0).
    """
    return extract_features(data)["entropy"]
