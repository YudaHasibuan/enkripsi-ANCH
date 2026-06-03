# `entropy()`

Compute the Shannon Entropy of a 256-bit hexadecimal hash digest. This measures the uniform distribution of bytes across the output landscape.

---

## Signature

```python
def entropy(digest: str) -> float
```

## Parameters

*   `digest` (str): A 64-character hexadecimal digest.

## Returns

*   `float`: The Shannon entropy index in bits per byte ∈ [0.0, 8.0]. A perfectly random output distribution yields exactly **8.0 bits/byte**.

## Example

```python
import anch

digest = anch.hash("hello world")

# Calculate entropy of digest
score = anch.entropy(digest)

print(f"Shannon Entropy: {score} bits/byte")
# Output: e.g. "7.985"
```
