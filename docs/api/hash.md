# `hash()`

Compute the 256-bit adaptive hash digest of a string or raw bytes.

---

## Signature

```python
def hash(data: Union[str, bytes]) -> str
```

## Parameters

*   `data` (str or bytes): The input payload to be hashed. If a string is provided, it is automatically encoded into bytes using UTF-8 before processing.

## Returns

*   `str`: A 64-character hexadecimal string representing the 256-bit hash digest.

## Example

```python
import anch

# String hashing
digest1 = anch.hash("hello world")

# Raw bytes hashing
digest2 = anch.hash(b"\x01\x02\x03\x04")

print(digest1)
# Output: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fcd5a3a2a6ef5312781b0a"
```
