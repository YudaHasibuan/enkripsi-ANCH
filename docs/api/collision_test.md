# `collision_test()`

Evaluate the collision resistance of the ANCH algorithm by hashing a list of input strings and searching for duplicate digests.

---

## Signature

```python
def collision_test(dataset: list[str]) -> dict
```

## Parameters

*   `dataset` (list[str]): A list of distinct strings to be hashed.

## Returns

*   `dict`: A dictionary containing collision statistics:
    *   `total` (int): Total number of items tested.
    *   `unique_digests` (int): Number of unique hash digests generated.
    *   `collisions` (int): Number of observed collisions.
    *   `collision_rate` (float): Percentage of tests that resulted in a collision.

## Example

```python
import anch

# Large set of test strings
test_inputs = [f"input_string_candidate_{i}" for i in range(5000)]

# Run collision check
report = anch.collision_test(test_inputs)

print(f"Total Collisions: {report['collisions']}")
print(f"Collision Rate: {report['collision_rate']}%")
```
