"""
ANCH Dynamic Permutation Engine
================================
Responsible for:
  - Dynamic bit-level permutation of the internal hash state
  - Bit shuffling using chaos-derived indices
  - Rotation-based diffusion

Permutation introduces the confusion and diffusion properties necessary
for an avalanche effect: small input changes propagate across the entire
state after permutation rounds.
"""

import struct
from typing import Sequence


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def _rotate_left_64(val: int, n: int) -> int:
    """Rotate a 64-bit integer left by n bits."""
    n %= 64
    return ((val << n) | (val >> (64 - n))) & 0xFFFFFFFFFFFFFFFF


def _rotate_right_64(val: int, n: int) -> int:
    """Rotate a 64-bit integer right by n bits."""
    n %= 64
    return ((val >> n) | (val << (64 - n))) & 0xFFFFFFFFFFFFFFFF


def _bytes_to_words(data: bytes) -> list[int]:
    """Split bytes into 64-bit unsigned integers (big-endian)."""
    n = len(data)
    # Pad to multiple of 8
    padded = data + b"\x00" * ((-n) % 8)
    count = len(padded) // 8
    return list(struct.unpack(">" + "Q" * count, padded))


def _words_to_bytes(words: list[int], target_len: int) -> bytes:
    """Pack 64-bit integers back into bytes, trimmed to target_len."""
    raw = struct.pack(">" + "Q" * len(words), *words)
    return raw[:target_len]


# ---------------------------------------------------------------------------
# Permutation index generation
# ---------------------------------------------------------------------------

def _generate_permutation_indices(
    size: int,
    seed: int,
    chaos_bytes: bytes,
) -> list[int]:
    """
    Generate a permutation index array of the given size using a
    Fisher-Yates shuffle seeded by seed and chaos_bytes.

    Args:
        size:        Length of the array to permute.
        seed:        Integer seed from neural parameters.
        chaos_bytes: Chaos-derived bytes for additional randomness.

    Returns:
        A list of indices [0, size) in shuffled order.
    """
    indices = list(range(size))
    n = len(chaos_bytes)

    # Combine seed and chaos into a state for a deterministic LCG
    state = seed ^ int.from_bytes(chaos_bytes[:8].ljust(8, b"\x00"), "big")
    a, c, m = 6364136223846793005, 1442695040888963407, 2**64

    for i in range(size - 1, 0, -1):
        state = (a * state + c) % m
        chaos_byte = chaos_bytes[i % n] if n > 0 else 0
        j = (state ^ chaos_byte) % (i + 1)
        indices[i], indices[j] = indices[j], indices[i]

    return indices


# ---------------------------------------------------------------------------
# Bit-level permutation
# ---------------------------------------------------------------------------

def permute_bits(state: bytearray, params: dict, chaos_bytes: bytes) -> bytearray:
    """
    Apply a dynamic bit-level permutation to the state bytearray.

    Each bit in the state is moved to a new position determined by the
    chaos-seeded permutation indices.

    Args:
        state:       The current hash state (modified in-place).
        params:      Neural parameters dict.
        chaos_bytes: Chaos-derived bytes for index generation.

    Returns:
        Permuted state bytearray (same object, modified in-place).
    """
    n_bits = len(state) * 8
    perm = _generate_permutation_indices(n_bits, params["permutation_seed"], chaos_bytes)

    # Extract bits
    original_bits = []
    for byte in state:
        for bit_pos in range(7, -1, -1):
            original_bits.append((byte >> bit_pos) & 1)

    # Scatter bits to new positions
    new_bits = [0] * n_bits
    for src, dst in enumerate(perm):
        new_bits[dst] = original_bits[src]

    # Pack back into bytes
    for i in range(len(state)):
        byte_val = 0
        for bit_pos in range(8):
            byte_val = (byte_val << 1) | new_bits[i * 8 + bit_pos]
        state[i] = byte_val

    return state


# ---------------------------------------------------------------------------
# Word-level rotation permutation (faster, suitable for large states)
# ---------------------------------------------------------------------------

def permute_words(state: bytearray, params: dict, chaos_bytes: bytes) -> bytearray:
    """
    Apply word-level rotation and shuffle to the state.

    This is a faster alternative to bit-level permutation used in
    intermediate rounds.  Each 64-bit word is:
      1. Rotated left by its chaos-derived rotation amount.
      2. Swapped with another word at a chaos-derived position.

    Args:
        state:       Current hash state (modified in-place).
        params:      Neural parameters dict.
        chaos_bytes: Chaos bytes for rotation and swap indices.

    Returns:
        Permuted state bytearray.
    """
    words = _bytes_to_words(bytes(state))
    rotations = params["rotations"]
    n = len(words)

    for i, word in enumerate(words):
        rot = rotations[i % len(rotations)]
        # Adjust rotation using chaos byte
        chaos_adj = chaos_bytes[i % len(chaos_bytes)] if chaos_bytes else 0
        effective_rot = (rot + chaos_adj) % 64 or 1
        words[i] = _rotate_left_64(word, effective_rot)

    # Swap pairs using chaos-derived indices
    perm = _generate_permutation_indices(n, params["permutation_seed"], chaos_bytes)
    shuffled = [words[perm[i]] for i in range(n)]

    result = _words_to_bytes(shuffled, len(state))
    for i in range(len(state)):
        state[i] = result[i] if i < len(result) else 0

    return state


# ---------------------------------------------------------------------------
# Combined permutation round
# ---------------------------------------------------------------------------

def apply_permutation(state: bytearray, params: dict, chaos_bytes: bytes) -> bytearray:
    """
    Apply a full permutation round consisting of:
      1. Word-level rotation and shuffle
      2. Bit-level permutation (on the 64-byte core only for speed)

    Args:
        state:       Current hash state.
        params:      Neural parameters.
        chaos_bytes: Chaos bytes for this round.

    Returns:
        Permuted state.
    """
    # Word permutation over the full state
    state = permute_words(state, params, chaos_bytes)

    # Bit permutation over first 8 bytes (64 bits) for fine diffusion
    core = bytearray(state[:8])
    core = permute_bits(core, params, chaos_bytes[:8] if len(chaos_bytes) >= 8 else chaos_bytes)
    state[:8] = core

    return state
