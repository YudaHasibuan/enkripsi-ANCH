# `hash_file()`

Compute the 256-bit adaptive hash digest of a physical file by streaming its contents in chunks. This prevents excessive memory usage for large files.

---

## Signature

```python
def hash_file(filepath: str) -> str
```

## Parameters

*   `filepath` (str): Absolute or relative system path to the file.

## Returns

*   `str`: A 64-character hexadecimal string representing the 256-bit hash digest.

## Raises

*   `FileNotFoundError`: If the file path does not point to a valid file.

## Example

```python
import anch

# Streaming file hash
digest = anch.hash_file("data/archive.zip")

print(f"Archive Hash: {digest}")
```
