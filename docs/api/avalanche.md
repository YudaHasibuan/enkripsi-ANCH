# `avalanche()`

Analyze the Avalanche Effect (diffusion properties) between two inputs. This calculates the percentage of bits that differ between the two computed hash digests.

---

## Signature

```python
def avalanche(data_a: Union[str, bytes], data_b: Union[str, bytes]) -> float
```

## Parameters

*   `data_a` (str or bytes): The first input payload.
*   `data_b` (str or bytes): The second input payload (typically perturbed by exactly 1 bit or 1 character).

## Returns

*   `float`: The avalanche factor percentage ∈ [0.0, 100.0]. The mathematical ideal for a high-quality cryptographic hash function is exactly **50.0%**.

## Example

```python
import anch

# Compute avalanche effect for a single character mutation
pct = anch.avalanche("hello", "hellp")

print(f"Avalanche Ratio: {pct}%")
# Output: e.g. "48.828125%"
```
