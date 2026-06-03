# Architectural Pipeline Deep-Dive

The ANCH Framework leverages a multi-layer hybrid hashing architecture. Unlike standard cryptographic hash functions that rely on fixed S-Boxes and round constants, ANCH dynamically structures its mathematical transformations using parameters derived from the properties of the input.

---

## 1. Feature Extraction Layer (`feature.py`)

The pipeline begins by scanning the raw input bytes. It extracts multiple statistical and structural features, representing them as a normalized **134-dimensional feature vector**:

*   **Hamming Weight (1 feature)**: Bit-level density (ratio of set bits).
*   **Shannon Entropy (1 feature)**: Character/byte-level randomness index (0.0 to 8.0).
*   **Byte Mean & Variance (2 features)**: Arithmetic metrics of byte values.
*   **XOR Checksum (1 feature)**: Fast structural checksum.
*   **Byte Frequency (64 features)**: 256-bin byte counts downsampled to 64 buckets.
*   **Bigram Transition Hash (64 features)**: Compact transition matrix mapping byte-pairs to track word order.

---

## 2. Neural Parameter Generation Layer (`neural.py`)

The extracted feature vector is fed into a lightweight, fixed-weight deterministic linear projection pipeline (no training required):

1.  **Checksum Hashing**: Computes a primary 64-bit integer checksum from the feature vector.
2.  **Dense Linear Projection Layer 1**: Maps the 134 features down to 32 hidden units using weights deterministically generated from the checksum via an LCG (Linear Congruential Generator). Activations use a numerically stable `sigmoid` activation.
3.  **Dense Linear Projection Layer 2**: Maps the 32 units to 16 output units using a `tanh` activation.
4.  **Parameter Extraction**: The outputs of the layers are decoded to configure:
    *   `seed` (64-bit): Primary chaotic attractor seed.
    *   `r_value` (float): Chaotic parameter for the Logistic Map.
    *   `rotations` (list of 8 ints): Bit-rotation values.
    *   `compression_key` (64-bit): Initial Feistel round key.
    *   `round_count` (int): Number of compression rounds ∈ [4, 16].
    *   `permutation_seed` (int): Fisher-Yates shuffle seed.

---

## 3. Adaptive Chaotic Engine (`chaos.py`)

Using the parameters derived in the neural layer, ANCH constructs a highly sensitive pseudo-random byte stream using one of three chaotic mappings:

$$\text{logistic: } x_{n+1} = r \cdot x_n \cdot (1 - x_n)$$
$$\text{tent: } x_{n+1} = \mu \cdot \min(x_n, 1 - x_n)$$
$$\text{hénon: } x_{n+1} = 1 - a \cdot x_n^2 + y_n, \quad y_{n+1} = b \cdot x_n$$

The map is selected adaptively using `seed % 3`, ensuring that different inputs deploy entirely different mathematical attractors. Periodic boundary wrapping prevents numerical divergence.

---

## 4. Dynamic Permutation Layer (`permutation.py`)

Bit-level and byte-level diffusions are accomplished using chaotic shuffles:

*   **Fisher-Yates Shuffle**: Uses the `permutation_seed` and the chaotic map stream to dynamically swap bit positions in the internal state.
*   **Bit-Rotation**: Cyclic bit-shifts are applied to words using the derived `rotations` schedule.

---

## 5. Compression Engine (`compression.py`)

The internal state is compressed into a final 256-bit block using a structure inspired by **Feistel Networks**:

1.  The state is split into left and right halves.
2.  For $K$ rounds (determined by `round_count`):
    *   The right half is mixed with the `compression_key` and chaotic byte stream.
    *   A round function applies rotations and non-linear XOR mixing.
    *   The left and right halves are swapped.
3.  The final state is folded into 32 bytes (256 bits) and returned as a 64-character hexadecimal string.
