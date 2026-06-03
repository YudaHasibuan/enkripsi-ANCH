"""
ANCH Core Engine
================
Orchestrates the full ANCH hashing pipeline:

  Input Data
    ↓
  Feature Extractor       (feature.py)
    ↓
  Neural Parameter Gen    (neural.py)
    ↓
  Chaotic Engine          (chaos.py)
    ↓
  Dynamic Permutation     (permutation.py)
    ↓
  Compression Engine      (compression.py)
    ↓
  ANCH Digest

This module also implements:
  - verify()         — constant-time digest comparison
  - hash_file()      — streaming file hashing
  - verify_file()    — file digest verification
  - avalanche()      — avalanche effect analysis
  - entropy()        — digest entropy analysis
  - collision_test() — collision testing over a dataset
"""

import hashlib
import hmac
import math
import os
import time
from pathlib import Path
from typing import Union

from anch import feature, neural, chaos, permutation, compression


# ---------------------------------------------------------------------------
# Internal pipeline
# ---------------------------------------------------------------------------

def _encode(data: Union[str, bytes]) -> bytes:
    """Ensure input is bytes."""
    if isinstance(data, str):
        return data.encode("utf-8")
    return data


def _run_pipeline(data: bytes) -> str:
    """
    Execute the full ANCH hashing pipeline and return a hex digest.

    Pipeline:
      1. Feature extraction
      2. Feature vector normalization
      3. Neural parameter generation
      4. Chaos state generation
      5. State initialization (compression seed)
      6. Permutation round
      7. Compression rounds
      8. Digest finalization

    Args:
        data: Raw input bytes.

    Returns:
        64-character lowercase hex string (256-bit digest).
    """
    # --- Stage 1: Feature Extraction ---
    feats = feature.extract_features(data)
    vec = feature.build_feature_vector(feats)

    # --- Stage 2: Neural Parameters ---
    params = neural.generate_parameters(vec)

    # --- Stage 3: Chaos State ---
    # Generate enough chaos bytes for permutation + compression rounds
    chaos_needed = 64 + params["round_count"] * 8
    chaos_bytes = chaos.generate_chaos_state(params, chaos_needed)

    # --- Stage 4: State Initialization ---
    state = compression.initialize_state(data, params)

    # --- Stage 5: Permutation ---
    state = permutation.apply_permutation(state, params, chaos_bytes[:64])

    # --- Stage 6: Chaos Mixing ---
    state = chaos.mix_state_with_chaos(state, chaos_bytes)

    # --- Stage 7: Compression ---
    state = compression.compress(state, params, chaos_bytes)

    # --- Stage 8: Final Permutation Pass ---
    state = permutation.apply_permutation(state, params, chaos_bytes[8:])

    # --- Stage 9: Digest Finalization ---
    return compression.finalize_digest(state, data)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def hash(data: Union[str, bytes]) -> str:
    """
    Hash a string or bytes value using the ANCH algorithm.

    Args:
        data: Input string or bytes.

    Returns:
        64-character lowercase hex digest string.

    Examples:
        >>> import anch
        >>> digest = anch.hash("hello world")
        >>> len(digest)
        64
        >>> anch.hash("hello world") == anch.hash("hello world")
        True
    """
    return _run_pipeline(_encode(data))


def verify(data: Union[str, bytes], digest: str) -> bool:
    """
    Verify that data produces the given ANCH digest.

    Uses constant-time comparison (hmac.compare_digest) to prevent
    timing side-channel attacks.

    Args:
        data:   Input data (str or bytes).
        digest: Expected ANCH hex digest.

    Returns:
        True if the digest matches, False otherwise.

    Examples:
        >>> import anch
        >>> d = anch.hash("test")
        >>> anch.verify("test", d)
        True
        >>> anch.verify("TEST", d)
        False
    """
    expected = hash(data)
    return hmac.compare_digest(expected.lower(), digest.lower())


def hash_file(filepath: Union[str, Path], chunk_size: int = 65536) -> str:
    """
    Compute the ANCH digest of a file using streaming reads.

    Large files are read in chunks and accumulated before hashing.
    For very large files (>256 MB) the chunks are merged via a
    Merkle-tree-inspired hierarchical reduction.

    Args:
        filepath:   Path to the file.
        chunk_size: Read chunk size in bytes (default 64 KiB).

    Returns:
        64-character lowercase hex digest.

    Raises:
        FileNotFoundError: If the file does not exist.
        IsADirectoryError: If the path is a directory.

    Examples:
        >>> import anch, tempfile, os
        >>> tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".txt")
        >>> _ = tmp.write(b"file content")
        >>> tmp.close()
        >>> digest = anch.hash_file(tmp.name)
        >>> len(digest)
        64
        >>> os.unlink(tmp.name)
    """
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    if path.is_dir():
        raise IsADirectoryError(f"Path is a directory: {filepath}")

    file_size = path.stat().st_size
    LARGE_FILE_THRESHOLD = 256 * 1024 * 1024  # 256 MB

    if file_size <= LARGE_FILE_THRESHOLD:
        # Simple: read all and hash
        with open(path, "rb") as f:
            data = f.read()
        return _run_pipeline(data)
    else:
        # Hierarchical: hash chunks then hash the concatenation of chunk digests
        chunk_digests = []
        with open(path, "rb") as f:
            while True:
                chunk = f.read(chunk_size)
                if not chunk:
                    break
                chunk_digests.append(_run_pipeline(chunk))
        # Merge: hash the concatenated hex digests as a meta-digest
        merged = "".join(chunk_digests).encode("ascii")
        return _run_pipeline(merged)


def verify_file(filepath: Union[str, Path], digest: str) -> bool:
    """
    Verify the ANCH digest of a file.

    Args:
        filepath: Path to the file.
        digest:   Expected ANCH hex digest.

    Returns:
        True if the digest matches, False otherwise.

    Raises:
        FileNotFoundError: If the file does not exist.

    Examples:
        >>> import anch, tempfile, os
        >>> tmp = tempfile.NamedTemporaryFile(delete=False)
        >>> _ = tmp.write(b"verify me")
        >>> tmp.close()
        >>> d = anch.hash_file(tmp.name)
        >>> anch.verify_file(tmp.name, d)
        True
        >>> os.unlink(tmp.name)
    """
    computed = hash_file(filepath)
    return hmac.compare_digest(computed.lower(), digest.lower())


def avalanche(data_a: Union[str, bytes], data_b: Union[str, bytes]) -> float:
    """
    Measure the avalanche effect between two inputs.

    The avalanche percentage is the proportion of bits that differ
    between the two ANCH digests.  A good hash function achieves ~50%.

    Args:
        data_a: First input.
        data_b: Second input (ideally differing by one bit or character).

    Returns:
        Percentage of differing bits (0.0 – 100.0).

    Examples:
        >>> import anch
        >>> pct = anch.avalanche("hello", "HELLO")
        >>> 0.0 <= pct <= 100.0
        True
    """
    digest_a = hash(data_a)
    digest_b = hash(data_b)

    bytes_a = bytes.fromhex(digest_a)
    bytes_b = bytes.fromhex(digest_b)

    differing_bits = 0
    total_bits = len(bytes_a) * 8

    for ba, bb in zip(bytes_a, bytes_b):
        xor = ba ^ bb
        differing_bits += bin(xor).count("1")

    return round((differing_bits / total_bits) * 100.0, 4)


def entropy(digest: str) -> float:
    """
    Calculate the Shannon entropy of an ANCH digest.

    A high-entropy digest (close to 8.0 bits/byte) indicates good
    distribution of output values.

    Args:
        digest: Hex-encoded ANCH digest string.

    Returns:
        Shannon entropy in bits per byte (0.0 – 8.0).

    Raises:
        ValueError: If digest is not a valid hex string.

    Examples:
        >>> import anch
        >>> d = anch.hash("test")
        >>> score = anch.entropy(d)
        >>> 0.0 <= score <= 8.0
        True
    """
    try:
        digest_bytes = bytes.fromhex(digest)
    except ValueError:
        raise ValueError(f"Invalid hex digest: {digest!r}")

    freq = [0] * 256
    for b in digest_bytes:
        freq[b] += 1

    n = len(digest_bytes)
    entropy_val = 0.0
    for f in freq:
        if f > 0:
            p = f / n
            entropy_val -= p * math.log2(p)

    return round(entropy_val, 6)


def collision_test(dataset: list[Union[str, bytes]]) -> dict:
    """
    Test for hash collisions across a dataset of inputs.

    Args:
        dataset: List of strings or bytes to hash and compare.

    Returns:
        dict with keys:
          - total (int):            number of inputs tested
          - unique_digests (int):   number of unique digests
          - collisions (int):       number of collisions detected
          - collision_pairs (list): list of (input_a, input_b) collision pairs
          - collision_rate (float): collisions / total as a percentage
          - digests (dict):         mapping of input → digest

    Examples:
        >>> import anch
        >>> report = anch.collision_test(["a", "b", "c", "a"])
        >>> report["total"]
        4
        >>> report["unique_digests"]
        3
    """
    digests: dict[str, Union[str, bytes]] = {}
    collision_pairs: list[tuple] = []

    for item in dataset:
        encoded = _encode(item)
        digest = hash(encoded)
        if digest in digests:
            collision_pairs.append((digests[digest], item))
        else:
            digests[digest] = item

    total = len(dataset)
    unique = len(digests)
    collisions = len(collision_pairs)

    return {
        "total": total,
        "unique_digests": unique,
        "collisions": collisions,
        "collision_pairs": collision_pairs,
        "collision_rate": round((collisions / total * 100.0) if total > 0 else 0.0, 6),
        "digests": {
            str(_encode(k)): v for k, v in digests.items()
        },
    }
