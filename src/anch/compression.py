"""
ANCH Compression Engine
========================
Responsible for:
  - Multi-round state compression
  - State transformation using neural + chaos parameters
  - Producing the final ANCH digest bytes

The compression engine takes the permuted internal state and applies
multiple rounds of mixing and folding to produce a compact, fixed-size
digest.  Each round uses a unique chaos-derived sub-key.
"""

import struct
import hashlib


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DIGEST_BITS = 256          # Output digest size in bits
DIGEST_BYTES = DIGEST_BITS // 8  # 32 bytes
STATE_BYTES = 64           # Internal state size


# ---------------------------------------------------------------------------
# Round function helpers
# ---------------------------------------------------------------------------

def _u64(x: int) -> int:
    """Mask to unsigned 64-bit integer."""
    return x & 0xFFFFFFFFFFFFFFFF


def _add64(a: int, b: int) -> int:
    return _u64(a + b)


def _xor64(a: int, b: int) -> int:
    return _u64(a ^ b)


def _rotate_left_64(val: int, n: int) -> int:
    n %= 64
    return _u64((val << n) | (val >> (64 - n)))


def _mix_pair(a: int, b: int, rotation: int) -> tuple[int, int]:
    """
    A single mixing step similar to a Feistel cipher round:
      a' = a + b
      b' = rotate_left(b, rotation) XOR a'
    """
    a2 = _add64(a, b)
    b2 = _xor64(_rotate_left_64(b, rotation), a2)
    return a2, b2


# ---------------------------------------------------------------------------
# State initialization
# ---------------------------------------------------------------------------

def initialize_state(data: bytes, params: dict) -> bytearray:
    """
    Initialize the 64-byte compression state from input data and parameters.

    The state is seeded by:
      - A SHA-512 digest of the input (provides input sensitivity)
      - XOR-folded with the neural compression key

    Args:
        data:   Raw input bytes.
        params: Neural parameters dict.

    Returns:
        64-byte bytearray state.
    """
    # SHA-512 as a mixing foundation (not the output — just for state seeding)
    sha_seed = hashlib.sha512(data).digest()  # 64 bytes

    key = params["compression_key"]
    key_bytes = key.to_bytes(8, "big") * 8  # Repeat 8-byte key to fill 64 bytes

    state = bytearray(len(sha_seed))
    for i in range(len(sha_seed)):
        state[i] = sha_seed[i] ^ key_bytes[i]

    return state


# ---------------------------------------------------------------------------
# Compression round
# ---------------------------------------------------------------------------

def compression_round(
    state: bytearray,
    round_key: int,
    rotations: list[int],
) -> bytearray:
    """
    Apply one compression round to the 64-byte state.

    The round operates on 8 words (64-bit each):
      1. XOR each word with the round key.
      2. Apply pairwise mixing with the round's rotation schedule.
      3. Perform a final butterfly mix across word halves.

    Args:
        state:     64-byte state bytearray.
        round_key: 64-bit round sub-key.
        rotations: List of rotation amounts.

    Returns:
        Modified state bytearray.
    """
    # Unpack into 8 × 64-bit words
    words = list(struct.unpack(">8Q", bytes(state)))

    # Step 1: XOR with round key
    for i in range(8):
        words[i] = _xor64(words[i], _u64(round_key * (i + 1)))

    # Step 2: Pairwise mixing
    for i in range(0, 8, 2):
        rot = rotations[(i // 2) % len(rotations)]
        words[i], words[i + 1] = _mix_pair(words[i], words[i + 1], rot)

    # Step 3: Cross-half butterfly
    for i in range(4):
        rot = rotations[(i + 4) % len(rotations)]
        words[i], words[i + 4] = _mix_pair(words[i], words[i + 4], rot)

    # Step 4: Final word-level diffusion
    for i in range(7):
        words[i + 1] = _xor64(words[i + 1], _rotate_left_64(words[i], rotations[i % len(rotations)]))

    # Pack back
    result = struct.pack(">8Q", *words)
    state[:] = result
    return state


# ---------------------------------------------------------------------------
# Multi-round compression
# ---------------------------------------------------------------------------

def compress(
    state: bytearray,
    params: dict,
    chaos_bytes: bytes,
) -> bytearray:
    """
    Run the full multi-round compression pipeline.

    Each round uses a unique sub-key derived from the compression key
    and the chaos byte stream.

    Args:
        state:       64-byte internal state.
        params:      Neural parameters dict.
        chaos_bytes: Chaos-derived byte stream (at least round_count * 8 bytes).

    Returns:
        Compressed 64-byte state.
    """
    base_key = params["compression_key"]
    round_count = params["round_count"]
    rotations = params["rotations"]

    for rnd in range(round_count):
        # Derive per-round sub-key from base key and chaos bytes
        chaos_offset = rnd * 8
        chaos_word = int.from_bytes(
            chaos_bytes[chaos_offset : chaos_offset + 8].ljust(8, b"\x00"),
            "big",
        )
        round_key = _u64(base_key ^ _rotate_left_64(chaos_word, rnd * 7))

        state = compression_round(state, round_key, rotations)

    return state


# ---------------------------------------------------------------------------
# Final digest extraction
# ---------------------------------------------------------------------------

def extract_digest(state: bytearray) -> bytes:
    """
    Extract the final 32-byte (256-bit) ANCH digest from the 64-byte state.

    The extraction folds the state in half (XOR) and then applies a
    final mixing pass to eliminate any remaining state biases.

    Args:
        state: 64-byte compressed state.

    Returns:
        32-byte digest.
    """
    # Fold: XOR first 32 bytes with last 32 bytes
    folded = bytearray(DIGEST_BYTES)
    for i in range(DIGEST_BYTES):
        folded[i] = state[i] ^ state[i + DIGEST_BYTES]

    # Final mixing pass over 4 × 64-bit words
    words = list(struct.unpack(">4Q", bytes(folded)))
    for i in range(4):
        for j in range(3):
            words[j + 1] = _u64(words[j + 1] ^ _rotate_left_64(words[j], 17 + j * 11))

    return struct.pack(">4Q", *words)


def finalize_digest(state: bytearray, data: bytes) -> str:
    """
    Produce the final hex-encoded ANCH digest.

    An HMAC-like finalizer that mixes the extracted digest with the
    original data length and first/last byte to prevent length-extension.

    Args:
        state: Compressed state.
        data:  Original input bytes.

    Returns:
        64-character lowercase hex string.
    """
    raw = extract_digest(state)

    # Anti-extension finalization: XOR with length-derived constant
    n = len(data)
    ext_const = bytearray(DIGEST_BYTES)
    for i in range(DIGEST_BYTES):
        ext_const[i] = (n >> (i % 8)) & 0xFF
    if data:
        ext_const[0] ^= data[0]
        ext_const[-1] ^= data[-1]

    final = bytes(a ^ b for a, b in zip(raw, bytes(ext_const)))
    return final.hex()
