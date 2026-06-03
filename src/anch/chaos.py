"""
ANCH Chaotic Engine
====================
Responsible for:
  - Logistic Map implementation
  - Chaos sequence generation from neural parameters

Future additions:
  - Tent Map
  - Hénon Map

The logistic map is defined as:
    x_{n+1} = r * x_n * (1 - x_n)

For r ∈ [3.57, 4.0] the system exhibits fully chaotic behavior,
producing a pseudo-random sequence that is extremely sensitive to
initial conditions.
"""

import struct
import math
from typing import Generator


# ---------------------------------------------------------------------------
# Logistic Map
# ---------------------------------------------------------------------------

def logistic_map(
    x0: float,
    r: float,
    n: int,
    warmup: int = 256,
) -> list[float]:
    """
    Generate n values from a logistic map with initial value x0 and parameter r.

    Args:
        x0:     Initial condition ∈ (0, 1).
        r:      Chaotic parameter ∈ [3.57, 4.0].
        n:      Number of output values to return.
        warmup: Number of iterations to discard (transient suppression).

    Returns:
        List of n floats ∈ (0, 1).

    Raises:
        ValueError: If x0 is not in (0, 1) or r is not in [3.57, 4.0].

    Examples:
        >>> seq = logistic_map(0.5, 3.99, 10)
        >>> len(seq)
        10
        >>> all(0.0 < v < 1.0 for v in seq)
        True
    """
    if not (0.0 < x0 < 1.0):
        raise ValueError(f"Initial condition x0 must be in (0, 1), got {x0}")
    if not (3.57 <= r <= 4.0):
        raise ValueError(f"r must be in [3.57, 4.0] for chaotic regime, got {r}")

    x = x0
    # Burn-in / transient suppression
    for _ in range(warmup):
        x = r * x * (1.0 - x)

    results: list[float] = []
    for _ in range(n):
        x = r * x * (1.0 - x)
        results.append(x)

    return results


def logistic_map_generator(
    x0: float,
    r: float,
    warmup: int = 256,
) -> Generator[float, None, None]:
    """
    Infinite generator version of the logistic map.

    Useful when the number of required values is not known in advance.
    """
    x = x0
    for _ in range(warmup):
        x = r * x * (1.0 - x)
    while True:
        x = r * x * (1.0 - x)
        yield x


# ---------------------------------------------------------------------------
# Tent Map (future-ready stub)
# ---------------------------------------------------------------------------

def tent_map(x0: float, mu: float, n: int, warmup: int = 256) -> list[float]:
    """
    Generate n values from a tent map.

    x_{n+1} = mu * min(x_n, 1 - x_n)

    Args:
        x0:  Initial condition ∈ (0, 1).
        mu:  Tent parameter, typically 2.0 for full chaos.
        n:   Number of output values.

    Note:
        This map is included for future multi-chaotic engine support (v0.3).
    """
    x = x0
    for _ in range(warmup):
        x = mu * min(x, 1.0 - x)

    results: list[float] = []
    for _ in range(n):
        x = mu * min(x, 1.0 - x)
        results.append(x)
    return results


# ---------------------------------------------------------------------------
# Chaos Sequence → Byte Stream
# ---------------------------------------------------------------------------

def chaos_sequence_to_bytes(
    sequence: list[float],
    length: int | None = None,
) -> bytes:
    """
    Convert a floating-point chaos sequence into a byte stream.

    Each float is mapped to a byte via floor(v * 256) % 256.

    Args:
        sequence: List of floats from a chaotic map.
        length:   If provided, truncate or repeat the sequence to this length.

    Returns:
        Bytes object of the requested length.
    """
    n = length or len(sequence)
    result = bytearray()
    seq_len = len(sequence)
    for i in range(n):
        v = sequence[i % seq_len]
        result.append(int(v * 256) % 256)
    return bytes(result)


def generate_chaos_state(params: dict, state_size: int = 64) -> bytes:
    """
    Generate a chaotic byte state using the neural parameters.

    The initial condition x0 is derived from the neural seed by
    mapping it into (0, 1) avoiding the fixed points 0 and 1.

    Args:
        params:     Neural parameters dict (from neural.generate_parameters).
        state_size: Number of bytes in the output state.

    Returns:
        Bytes of length state_size.
    """
    seed = params["seed"]
    r = params["r_value"]

    # Derive x0 from seed: map to (0.001, 0.999)
    x0 = ((seed % 10_000_007) / 10_000_007.0) * 0.998 + 0.001

    sequence = logistic_map(x0, r, state_size + 16)
    return chaos_sequence_to_bytes(sequence, state_size)


def mix_state_with_chaos(state: bytearray, chaos_bytes: bytes) -> bytearray:
    """
    XOR-mix a mutable state buffer with chaos-derived bytes.

    Args:
        state:       Mutable bytearray (modified in-place and returned).
        chaos_bytes: Bytes to XOR into the state.

    Returns:
        The modified state bytearray.
    """
    n = len(state)
    for i in range(n):
        state[i] ^= chaos_bytes[i % len(chaos_bytes)]
    return state
