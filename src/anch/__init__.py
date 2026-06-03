"""
ANCH - Adaptive Neural Chaotic Hash Framework
==============================================
An experimental adaptive hashing framework that combines:
  - Feature Extraction
  - Neural Parameter Generation
  - Chaos Theory
  - Dynamic Permutation
  - Compression Engine

Version: 0.1.0
"""

from anch.core import (
    hash,
    verify,
    hash_file,
    verify_file,
    avalanche,
    entropy,
    collision_test,
)

__version__ = "0.1.0"
__author__ = "ANCH Framework Team"
__all__ = [
    "hash",
    "verify",
    "hash_file",
    "verify_file",
    "avalanche",
    "entropy",
    "collision_test",
]
