# Practical Examples

Here are some real-world integration examples showing how to use the ANCH Framework inside larger Python applications.

---

## 1. File Integrity & Fingerprinting

This example shows how to write a script that generates a database of file fingerprints for a directory and verifies their integrity later.

```python
import os
import json
import anch

def catalog_directory(dir_path: str) -> dict:
    catalog = {}
    for root, _, files in os.walk(dir_path):
        for file in files:
            full_path = os.path.join(root, file)
            try:
                # Compute adaptive hash
                file_hash = os.path.relpath(full_path, dir_path)
                catalog[file_hash] = anch.hash_file(full_path)
            except Exception as e:
                print(f"Failed to hash {file}: {e}")
    return catalog

# Create catalog
my_catalog = catalog_directory("./src")

# Save catalog to JSON
with open("fingerprints.json", "w") as f:
    json.dump(my_catalog, f, indent=2)

print("Directory cataloged successfully!")
```

---

## 2. Using Custom Salt

ANCH has no built-in "salt" parameter, but you can achieve hashing salt/keying by prepending the salt to the input bytes before feeding it to `anch.hash`:

```python
import os
import anch

def hash_password_with_salt(password: str, salt: bytes = None) -> tuple[str, bytes]:
    # Generate a random 16-byte salt if not provided
    if salt is None:
        salt = os.urandom(16)
    
    # Prepend salt to password bytes
    salted_payload = salt + password.encode('utf-8')
    
    # Generate hash
    password_hash = anch.hash(salted_payload)
    
    return password_hash, salt

# Usage
hashed, used_salt = hash_password_with_salt("mySuperSecretPassword")
print(f"Hashed: {hashed}")
print(f"Salt (hex): {used_salt.hex()}")
```
