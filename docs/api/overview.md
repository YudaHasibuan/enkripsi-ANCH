# API Reference Overview

The ANCH SDK exposes a minimal and cohesive public API. All core utilities can be imported directly from the root `anch` package.

---

## Core Functions

| Function | Signature | Return Type | Description |
|---|---|---|---|
| [`hash()`](hash.md) | `hash(data: Union[str, bytes])` | `str` | Computes the 256-bit adaptive hash digest of the input. |
| [`verify()`](verify.md) | `verify(data: Union[str, bytes], digest: str)` | `bool` | Verifies whether the input data matches the expected digest. |
| [`hash_file()`](hash_file.md) | `hash_file(filepath: str)` | `str` | Computes the 256-bit adaptive hash digest of a physical file. |
| [`avalanche()`](avalanche.md) | `avalanche(data_a: Union[str, bytes], data_b: Union[str, bytes])` | `float` | Calculates the avalanche effect percentage between two inputs. |
| [`entropy()`](entropy.md) | `entropy(digest: str)` | `float` | Calculates the Shannon entropy of a 64-character hex digest. |
| [`collision_test()`](collision_test.md) | `collision_test(dataset: list[str])` | `dict` | Runs a collision benchmark over a dataset of inputs. |

---

## Modular Sub-packages

Under the hood, ANCH is divided into specialized modules. Advanced users can import these modules directly for research or customization:

*   `anch.feature`: Bit-level statistics and feature vector extraction.
*   `anch.neural`: Linear projection weights and parameter generator.
*   `anch.chaos`: Logistic, Tent, and Hénon map chaotic generators.
*   `anch.permutation`: Fisher-Yates chaotic bit shuffling and rotations.
*   `anch.compression`: Multi-round Feistel-based compression engine.
*   `anch.benchmark`: Integrates the automated cryptographic benchmark suite.
