"""
Tests for ANCH internal modules: feature, neural, chaos, permutation, compression.
"""

import pytest
from anch import feature, neural, chaos, permutation, compression


class TestFeatureExtractor:
    def test_empty_input(self):
        feats = feature.extract_features(b"")
        assert feats["length"] == 0
        assert feats["entropy"] == 0.0
        assert feats["bit_count"] == 0

    def test_single_byte(self):
        feats = feature.extract_features(b"\xff")
        assert feats["length"] == 1
        assert feats["bit_count"] == 8
        assert feats["checksum"] == 0xFF

    def test_entropy_range(self):
        feats = feature.extract_features(b"hello world test input")
        assert 0.0 <= feats["entropy"] <= 8.0

    def test_feature_vector_length(self):
        feats = feature.extract_features(b"test")
        vec = feature.build_feature_vector(feats)
        assert len(vec) == 134

    def test_feature_vector_normalized(self):
        feats = feature.extract_features(b"test data")
        vec = feature.build_feature_vector(feats)
        # All values should be in [0, 1] (or slightly above for some)
        # We allow small overflows due to normalization edge cases
        assert all(-0.1 <= v <= 1.1 for v in vec)

    def test_high_entropy_input(self):
        data = bytes(range(256))
        feats = feature.extract_features(data)
        # All bytes appear once: max entropy = log2(256) = 8.0
        assert abs(feats["entropy"] - 8.0) < 0.01

    def test_compute_input_entropy(self):
        score = feature.compute_input_entropy(b"hello")
        assert 0.0 <= score <= 8.0


class TestNeuralGenerator:
    def _make_vec(self) -> list:
        feats = feature.extract_features(b"test input")
        return feature.build_feature_vector(feats)

    def test_returns_dict(self):
        vec = self._make_vec()
        params = neural.generate_parameters(vec)
        assert isinstance(params, dict)

    def test_required_keys(self):
        vec = self._make_vec()
        params = neural.generate_parameters(vec)
        for key in ("seed", "r_value", "rotations", "compression_key", "round_count", "permutation_seed"):
            assert key in params

    def test_r_value_range(self):
        vec = self._make_vec()
        params = neural.generate_parameters(vec)
        assert 3.57 <= params["r_value"] <= 4.0

    def test_round_count_range(self):
        vec = self._make_vec()
        params = neural.generate_parameters(vec)
        assert 4 <= params["round_count"] <= 16

    def test_rotations_count(self):
        vec = self._make_vec()
        params = neural.generate_parameters(vec)
        assert len(params["rotations"]) == 8

    def test_deterministic(self):
        vec = self._make_vec()
        p1 = neural.generate_parameters(vec)
        p2 = neural.generate_parameters(vec)
        assert p1 == p2


class TestChaosEngine:
    def test_logistic_map_length(self):
        seq = chaos.logistic_map(0.5, 3.99, 100)
        assert len(seq) == 100

    def test_logistic_map_range(self):
        seq = chaos.logistic_map(0.5, 3.99, 50)
        assert all(0.0 < v < 1.0 for v in seq)

    def test_logistic_map_invalid_x0(self):
        with pytest.raises(ValueError):
            chaos.logistic_map(0.0, 3.99, 10)
        with pytest.raises(ValueError):
            chaos.logistic_map(1.0, 3.99, 10)

    def test_logistic_map_invalid_r(self):
        with pytest.raises(ValueError):
            chaos.logistic_map(0.5, 2.0, 10)

    def test_chaos_to_bytes_length(self):
        seq = chaos.logistic_map(0.5, 3.99, 32)
        b = chaos.chaos_sequence_to_bytes(seq, 32)
        assert len(b) == 32

    def test_generate_chaos_state(self):
        feats = feature.extract_features(b"hello")
        vec = feature.build_feature_vector(feats)
        params = neural.generate_parameters(vec)
        state = chaos.generate_chaos_state(params, 64)
        assert len(state) == 64
        assert isinstance(state, bytes)

    def test_tent_map(self):
        seq = chaos.tent_map(0.3, 2.0, 20)
        assert len(seq) == 20

    def test_mix_state_with_chaos(self):
        state = bytearray(b"hello world test!!")
        chaos_b = bytes(range(len(state)))
        result = chaos.mix_state_with_chaos(state, chaos_b)
        assert len(result) == len(b"hello world test!!")


class TestPermutation:
    def _make_params(self) -> dict:
        feats = feature.extract_features(b"permutation test")
        vec = feature.build_feature_vector(feats)
        return neural.generate_parameters(vec)

    def test_permute_words_preserves_length(self):
        params = self._make_params()
        state = bytearray(64)
        for i in range(64):
            state[i] = i
        chaos_b = bytes(range(64))
        result = permutation.permute_words(state, params, chaos_b)
        assert len(result) == 64

    def test_apply_permutation_preserves_length(self):
        params = self._make_params()
        state = bytearray(64)
        chaos_b = bytes(range(64))
        result = permutation.apply_permutation(state, params, chaos_b)
        assert len(result) == 64

    def test_permutation_changes_state(self):
        params = self._make_params()
        state = bytearray(range(64))
        original = bytes(state)
        chaos_b = bytes(range(64))
        permutation.apply_permutation(state, params, chaos_b)
        assert bytes(state) != original


class TestCompression:
    def _setup(self):
        data = b"compression engine test"
        feats = feature.extract_features(data)
        vec = feature.build_feature_vector(feats)
        params = neural.generate_parameters(vec)
        return data, params

    def test_generate_sbox(self):
        chaos_bytes = bytes(range(64))
        sbox = compression.generate_sbox(chaos_bytes)
        assert len(sbox) == 256
        assert sorted(sbox) == list(range(256))  # It must be a permutation

    def test_apply_sbox(self):
        state = bytearray(range(64))
        sbox = list(range(256))
        sbox.reverse()
        original = bytes(state)
        compression.apply_sbox(state, sbox)
        assert bytes(state) != original
        assert state[0] == 255

    def test_initialize_state_length(self):
        data, params = self._setup()
        state = compression.initialize_state(data, params)
        assert len(state) == 64

    def test_compression_round(self):
        _, params = self._setup()
        state = bytearray(b"\xab" * 64)
        original = bytes(state)
        state = compression.compression_round(state, 0xDEADBEEF, params["rotations"])
        assert bytes(state) != original
        assert len(state) == 64

    def test_full_compress(self):
        data, params = self._setup()
        state = compression.initialize_state(data, params)
        chaos_bytes = bytes(range(200))
        state = compression.compress(state, params, chaos_bytes)
        assert len(state) == 64

    def test_extract_digest_length(self):
        data, params = self._setup()
        state = compression.initialize_state(data, params)
        digest = compression.extract_digest(state)
        assert len(digest) == 32

    def test_finalize_digest(self):
        data, params = self._setup()
        state = compression.initialize_state(data, params)
        digest = compression.finalize_digest(state, data)
        assert isinstance(digest, str)
        assert len(digest) == 64
