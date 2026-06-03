# Quick Start Guide

This guide will walk you through the basic usage of the ANCH Framework in your Python scripts.

---

## 1. Basic Hashing

To compute a 256-bit hexadecimal hash of a string, use the `anch.hash` function:

```python
import anch

# Compute hash digest
digest = anch.hash("hello world")

print(f"Digest: {digest}")
# Output: a 64-character hexadecimal string representing the 256-bit hash
```

---

## 2. Hash Verification

To verify if an input matches a given hash digest (useful for passwords, integrity checking, or authentication), use the `anch.verify` function:

```python
import anch

digest = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fcd5a3a2a6ef5312781b0a" # example

# Check if input matches
is_valid = anch.verify("hello world", digest)

print(f"Verification matched: {is_valid}")
# Output: True or False
```

---

## 3. Hashing Files

To compute the hash of a physical file on your disk without loading the entire file into memory at once, use the `anch.hash_file` function:

```python
import anch

# Compute digest for a file
file_digest = anch.hash_file("path/to/document.pdf")

print(f"File Hash: {file_digest}")

# Verify file integrity
is_file_valid = anch.verify_file("path/to/document.pdf", file_digest)
print(f"File is intact: {is_file_valid}") # True
```

---

## 4. Run Hashing via CLI

You can also run all these commands directly from your terminal using the built-in CLI:

```bash
# Get help
anch --help

# Hash a string
anch hash "hello world"

# Hash a file
anch hash-file docs/index.md

# Verify a hash
anch verify "hello world" <hex_digest>

# Run the performance benchmark suite
anch benchmark --samples 50
```
