# Installation Guide

Setting up the ANCH Framework is simple and fast. The core framework is designed with **zero external dependencies**, requiring only a standard Python 3.12+ installation.

---

## 1. Install via PyPI (Stable)

You can install the official stable version directly using `pip`:

```bash
pip install anch-hash
```

---

## 2. Install from Source (Development)

If you wish to explore the code, modify the modules, or run the Next.js playground dashboard locally, clone the repository and install in editable mode:

```bash
# Clone the repository
git clone https://github.com/YudaHasibuan/enkripsi-ANCH.git
cd enkripsi-ANCH

# Install with development tools (pytest, coverage, etc.)
pip install -e ".[dev]"
```

---

## 3. High-Performance Acceleration (Optional)

ANCH includes vectorized algorithms that can speed up feature extraction for large files. To enable this high-performance mode, install `numpy` in your environment:

```bash
pip install numpy
```

Once `numpy` is installed, the feature extractor will automatically detect it and switch from pure-Python iteration to vectorized C-level execution. No configuration changes are required.

---

## 4. Run Verification Suite

To verify that the installation is fully functional on your machine, run the Pytest test suite:

```bash
python -m pytest
```

If all 69 tests pass, your ANCH installation is ready!
