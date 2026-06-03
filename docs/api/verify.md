# `verify()`

Verify if the computed hash of an input data payload matches an expected digest. Uses constant-time comparison to protect against timing attacks.

---

## Signature

```python
def verify(data: Union[str, bytes], digest: str) -> bool
```

## Parameters

*   `data` (str or bytes): The input payload to verify.
*   `digest` (str): The expected 64-character hexadecimal digest.

## Returns

*   `bool`: `True` if the computed digest matches the expected digest, `False` otherwise.

## Example

```python
import anch

digest = anch.hash("hello world")

# Success case
matched = anch.verify("hello world", digest)
print(matched) # True

# Failure case
matched = anch.verify("hello world!", digest)
print(matched) # False
```
