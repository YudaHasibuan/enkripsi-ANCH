"""
ANCH Test Suite — Core API
"""

import pytest
import tempfile
import os

import anch


# ---------------------------------------------------------------------------
# hash()
# ---------------------------------------------------------------------------

class TestHash:
    def test_returns_string(self):
        result = anch.hash("hello")
        assert isinstance(result, str)

    def test_digest_length_64(self):
        result = anch.hash("hello world")
        assert len(result) == 64

    def test_hex_characters_only(self):
        result = anch.hash("test input")
        assert all(c in "0123456789abcdef" for c in result)

    def test_deterministic(self):
        assert anch.hash("hello") == anch.hash("hello")
        assert anch.hash("hello") == anch.hash(b"hello")

    def test_empty_string(self):
        result = anch.hash("")
        assert len(result) == 64

    def test_empty_bytes(self):
        result = anch.hash(b"")
        assert len(result) == 64

    def test_different_inputs_different_digests(self):
        assert anch.hash("hello") != anch.hash("Hello")
        assert anch.hash("hello") != anch.hash("hello ")
        assert anch.hash("abc") != anch.hash("abd")

    def test_bytes_input(self):
        result = anch.hash(b"\x00\xff\x7f\x80")
        assert len(result) == 64

    def test_unicode_input(self):
        result = anch.hash("こんにちは世界")
        assert len(result) == 64

    def test_long_input(self):
        result = anch.hash("x" * 10_000)
        assert len(result) == 64

    def test_binary_data(self):
        result = anch.hash(bytes(range(256)))
        assert len(result) == 64


# ---------------------------------------------------------------------------
# verify()
# ---------------------------------------------------------------------------

class TestVerify:
    def test_correct_digest_returns_true(self):
        data = "hello world"
        digest = anch.hash(data)
        assert anch.verify(data, digest) is True

    def test_wrong_data_returns_false(self):
        digest = anch.hash("hello world")
        assert anch.verify("hello worlds", digest) is False

    def test_wrong_digest_returns_false(self):
        assert anch.verify("hello", "a" * 64) is False

    def test_case_insensitive_digest(self):
        digest = anch.hash("hello")
        assert anch.verify("hello", digest.upper()) is True

    def test_bytes_data(self):
        data = b"binary data"
        digest = anch.hash(data)
        assert anch.verify(data, digest) is True

    def test_empty_data(self):
        digest = anch.hash("")
        assert anch.verify("", digest) is True


# ---------------------------------------------------------------------------
# hash_file() and verify_file()
# ---------------------------------------------------------------------------

class TestHashFile:
    def _make_temp_file(self, content: bytes) -> str:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(content)
        tmp.close()
        return tmp.name

    def test_basic_file_hash(self):
        path = self._make_temp_file(b"file content")
        try:
            result = anch.hash_file(path)
            assert len(result) == 64
        finally:
            os.unlink(path)

    def test_deterministic_file_hash(self):
        path = self._make_temp_file(b"consistent content")
        try:
            assert anch.hash_file(path) == anch.hash_file(path)
        finally:
            os.unlink(path)

    def test_empty_file(self):
        path = self._make_temp_file(b"")
        try:
            result = anch.hash_file(path)
            assert len(result) == 64
        finally:
            os.unlink(path)

    def test_file_not_found_raises(self):
        with pytest.raises(FileNotFoundError):
            anch.hash_file("/nonexistent/path/file.txt")

    def test_directory_raises(self):
        with pytest.raises(IsADirectoryError):
            anch.hash_file(tempfile.gettempdir())

    def test_verify_file_correct(self):
        path = self._make_temp_file(b"verify me")
        try:
            digest = anch.hash_file(path)
            assert anch.verify_file(path, digest) is True
        finally:
            os.unlink(path)

    def test_verify_file_wrong_digest(self):
        path = self._make_temp_file(b"verify me")
        try:
            assert anch.verify_file(path, "a" * 64) is False
        finally:
            os.unlink(path)

    def test_different_files_different_digests(self):
        path_a = self._make_temp_file(b"content A")
        path_b = self._make_temp_file(b"content B")
        try:
            assert anch.hash_file(path_a) != anch.hash_file(path_b)
        finally:
            os.unlink(path_a)
            os.unlink(path_b)


# ---------------------------------------------------------------------------
# avalanche()
# ---------------------------------------------------------------------------

class TestAvalanche:
    def test_returns_float(self):
        result = anch.avalanche("hello", "HELLO")
        assert isinstance(result, float)

    def test_range_0_to_100(self):
        result = anch.avalanche("hello", "HELLO")
        assert 0.0 <= result <= 100.0

    def test_identical_inputs_zero(self):
        result = anch.avalanche("hello", "hello")
        assert result == 0.0

    def test_near_50_percent_for_single_bit_flip(self):
        # Flipping one bit should change ~50% of output bits
        original = b"hello world test"
        flipped = bytearray(original)
        flipped[0] ^= 1
        result = anch.avalanche(original, bytes(flipped))
        # Allow a generous range since this is experimental
        assert 10.0 <= result <= 90.0

    def test_bytes_input(self):
        result = anch.avalanche(b"abc", b"abd")
        assert 0.0 <= result <= 100.0


# ---------------------------------------------------------------------------
# entropy()
# ---------------------------------------------------------------------------

class TestEntropy:
    def test_returns_float(self):
        digest = anch.hash("hello")
        result = anch.entropy(digest)
        assert isinstance(result, float)

    def test_range_0_to_8(self):
        digest = anch.hash("test")
        result = anch.entropy(digest)
        assert 0.0 <= result <= 8.0

    def test_invalid_hex_raises(self):
        with pytest.raises(ValueError):
            anch.entropy("not-valid-hex!!")

    def test_all_same_bytes_low_entropy(self):
        # All-zero digest should have entropy 0
        all_zeros = "00" * 32
        result = anch.entropy(all_zeros)
        assert result == 0.0

    def test_high_entropy_for_random_like_digest(self):
        # Digest of varied input should have decent entropy
        digest = anch.hash("random-ish input data 12345 !@#$%")
        result = anch.entropy(digest)
        # Should be at least somewhat entropic
        assert result > 1.0


# ---------------------------------------------------------------------------
# collision_test()
# ---------------------------------------------------------------------------

class TestCollisionTest:
    def test_no_collisions_in_distinct_inputs(self):
        dataset = [f"item_{i}" for i in range(20)]
        report = anch.collision_test(dataset)
        assert report["total"] == 20
        assert report["unique_digests"] == 20
        assert report["collisions"] == 0

    def test_same_input_repeated(self):
        dataset = ["hello", "world", "hello"]
        report = anch.collision_test(dataset)
        assert report["total"] == 3
        assert report["unique_digests"] == 2
        assert report["collisions"] == 1

    def test_empty_dataset(self):
        report = anch.collision_test([])
        assert report["total"] == 0
        assert report["unique_digests"] == 0
        assert report["collisions"] == 0
        assert report["collision_rate"] == 0.0

    def test_bytes_dataset(self):
        dataset = [b"a", b"b", b"c"]
        report = anch.collision_test(dataset)
        assert report["collisions"] == 0

    def test_report_structure(self):
        report = anch.collision_test(["x", "y"])
        assert "total" in report
        assert "unique_digests" in report
        assert "collisions" in report
        assert "collision_pairs" in report
        assert "collision_rate" in report


# ---------------------------------------------------------------------------
# HMAC-ANCH
# ---------------------------------------------------------------------------

class TestHMAC:
    def test_hmac_returns_string(self):
        result = anch.hmac_anch("key", "message")
        assert isinstance(result, str)
        assert len(result) == 64

    def test_hmac_deterministic(self):
        assert anch.hmac_anch("key", "message") == anch.hmac_anch("key", "message")

    def test_hmac_different_keys_different_macs(self):
        assert anch.hmac_anch("key1", "message") != anch.hmac_anch("key2", "message")

    def test_hmac_different_messages_different_macs(self):
        assert anch.hmac_anch("key", "message1") != anch.hmac_anch("key", "message2")

    def test_hmac_long_key(self):
        long_key = "k" * 100
        result = anch.hmac_anch(long_key, "message")
        assert len(result) == 64

    def test_hmac_verify_correct(self):
        key = "secret_key"
        msg = "data to authenticate"
        mac = anch.hmac_anch(key, msg)
        assert anch.hmac_anch_verify(key, msg, mac) is True

    def test_hmac_verify_wrong_key(self):
        msg = "data to authenticate"
        mac = anch.hmac_anch("key1", msg)
        assert anch.hmac_anch_verify("key2", msg, mac) is False

    def test_hmac_verify_wrong_msg(self):
        key = "secret_key"
        mac = anch.hmac_anch(key, "msg1")
        assert anch.hmac_anch_verify(key, "msg2", mac) is False

