/**
 * ANCH — Adaptive Neural Chaotic Hash Framework (JavaScript Bindings)
 * ===================================================================
 * A dependency-free pure JavaScript implementation of the ANCH hashing algorithm.
 * Identical to the Python implementation.
 */

// Buffers for float64 to uint64 bit-level representation
const floatBuffer = new Float64Array(1);
const uintBuffer = new BigUint64Array(floatBuffer.buffer);

function getDoubleBits(v) {
    floatBuffer[0] = v;
    return uintBuffer[0];
}

// Helper: read a 64-bit big-endian integer from a byte array
function readUint64BE(bytes, offset) {
    let val = 0n;
    for (let i = 0; i < 8; i++) {
        const b = bytes[offset + i] !== undefined ? bytes[offset + i] : 0;
        val = (val << 8n) | BigInt(b);
    }
    return val;
}

// Helper: write a 64-bit big-endian integer to a byte array
function writeUint64BE(bytes, offset, val) {
    let temp = val;
    for (let i = 7; i >= 0; i--) {
        bytes[offset + i] = Number(temp & 0xFFn);
        temp >>= 8n;
    }
}

// Helper: rotate a 64-bit integer left
function rotateLeft64(val, n) {
    n = n % 64;
    return ((val << BigInt(n)) | (val >> BigInt(64 - n))) & 0xFFFFFFFFFFFFFFFFn;
}

// Helper: rotate a 64-bit integer right
function rotateRight64(val, n) {
    n = n % 64;
    return ((val >> BigInt(n)) | (val << BigInt(64 - n))) & 0xFFFFFFFFFFFFFFFFn;
}

// Helper: Python-like modulo for floating point numbers
function pythonModulo(val, mod) {
    return ((val % mod) + mod) % mod;
}

// Helper: encode string or Uint8Array to Uint8Array
function encode(data) {
    if (typeof data === "string") {
        return new TextEncoder().encode(data);
    } else if (data instanceof Uint8Array) {
        return data;
    } else {
        throw new Error("Input data must be a string or Uint8Array");
    }
}

// Helper: constant time comparison for digests
function constantTimeCompare(a, b) {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (aLower.length !== bLower.length) return false;
    let diff = 0;
    for (let i = 0; i < aLower.length; i++) {
        diff |= aLower.charCodeAt(i) ^ bLower.charCodeAt(i);
    }
    return diff === 0;
}

// ---------------------------------------------------------------------------
// SHA-512 Helper (for internal state seeding)
// ---------------------------------------------------------------------------

function sha512(message) {
    const K = [
        0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn, 0xe9b5dba58189dbbcn,
        0x3956c25bf348b538n, 0x59f111f1b605d019n, 0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n,
        0xd807aa98a3030242n, 0x12835b0145706fben, 0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n,
        0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n, 0xc19bf174cf692694n,
        0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n, 0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n,
        0x2de92c6f592b0275n, 0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n,
        0x983e5152ee66dfabn, 0xa831c66d2db43210n, 0xb00327c898fb213fn, 0xbf597fc7beef0ee4n,
        0xc6e00bf33da88fc2n, 0xd5a79147930aa725n, 0x06ca6351e003826fn, 0x142929670a0e6e70n,
        0x27b70a8546d22ffcn, 0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 0x53380d139d95b3dfn,
        0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n, 0x92722c851482353bn,
        0xa2bfe8a14cf10364n, 0xa81a664bbc423001n, 0xc24b8b70d0f89791n, 0xc76c51a30654be30n,
        0xd192e819d6ef5218n, 0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n,
        0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 0x2748774cdf8eeb99n, 0x34b0bcb5e19b48a8n,
        0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn, 0x5b9cca4f7763e373n, 0x682e6ff3d6b2b8a3n,
        0x748f82ee5defb2fcn, 0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn,
        0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n, 0xc67178f2e372532bn,
        0xca273eceea26619cn, 0xd186b8c721c0c207n, 0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n,
        0x06f067aa72176fban, 0x0a637dc5a2c898a6n, 0x113f9804bef90daen, 0x1b710b35131c471bn,
        0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn, 0x431d67c49c100d4cn,
        0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an, 0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n
    ];

    let h0 = 0x6a09e667f3bcc908n;
    let h1 = 0xbb67ae8584caa73bn;
    let h2 = 0x3c6ef372fe94f82bn;
    let h3 = 0xa54ff53a5f1d36f1n;
    let h4 = 0x510e527fade682d1n;
    let h5 = 0x9b05688c2b3e6c1fn;
    let h6 = 0x1f83d9abfb41bd6bn;
    let h7 = 0x5be0cd19137e2179n;

    const len = message.length;
    const bitLen = BigInt(len) * 8n;
    const padLen = (128 - ((len + 1 + 16) % 128)) % 128;
    const padded = new Uint8Array(len + 1 + padLen + 16);
    padded.set(message, 0);
    padded[len] = 0x80;
    
    const view = new DataView(padded.buffer);
    view.setBigUint64(padded.length - 8, bitLen, false);

    for (let chunkOffset = 0; chunkOffset < padded.length; chunkOffset += 128) {
        const W = new BigUint64Array(80);
        for (let t = 0; t < 16; t++) {
            W[t] = view.getBigUint64(chunkOffset + t * 8, false);
        }
        for (let t = 16; t < 80; t++) {
            const w15 = W[t - 15];
            const s0 = rotateRight64(w15, 1) ^ rotateRight64(w15, 8) ^ (w15 >> 7n);
            const w2 = W[t - 2];
            const s1 = rotateRight64(w2, 19) ^ rotateRight64(w2, 61) ^ (w2 >> 6n);
            W[t] = (W[t - 16] + s0 + W[t - 7] + s1) & 0xFFFFFFFFFFFFFFFFn;
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

        for (let t = 0; t < 80; t++) {
            const S1 = rotateRight64(e, 14) ^ rotateRight64(e, 18) ^ rotateRight64(e, 41);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + K[t] + W[t]) & 0xFFFFFFFFFFFFFFFFn;
            const S0 = rotateRight64(a, 28) ^ rotateRight64(a, 34) ^ rotateRight64(a, 39);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) & 0xFFFFFFFFFFFFFFFFn;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) & 0xFFFFFFFFFFFFFFFFn;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) & 0xFFFFFFFFFFFFFFFFn;
        }

        h0 = (h0 + a) & 0xFFFFFFFFFFFFFFFFn;
        h1 = (h1 + b) & 0xFFFFFFFFFFFFFFFFn;
        h2 = (h2 + c) & 0xFFFFFFFFFFFFFFFFn;
        h3 = (h3 + d) & 0xFFFFFFFFFFFFFFFFn;
        h4 = (h4 + e) & 0xFFFFFFFFFFFFFFFFn;
        h5 = (h5 + f) & 0xFFFFFFFFFFFFFFFFn;
        h6 = (h6 + g) & 0xFFFFFFFFFFFFFFFFn;
        h7 = (h7 + h) & 0xFFFFFFFFFFFFFFFFn;
    }

    const digest = new Uint8Array(64);
    const digestView = new DataView(digest.buffer);
    digestView.setBigUint64(0, h0, false);
    digestView.setBigUint64(8, h1, false);
    digestView.setBigUint64(16, h2, false);
    digestView.setBigUint64(24, h3, false);
    digestView.setBigUint64(32, h4, false);
    digestView.setBigUint64(40, h5, false);
    digestView.setBigUint64(48, h6, false);
    digestView.setBigUint64(56, h7, false);
    return digest;
}

// ---------------------------------------------------------------------------
// Feature Extraction (feature.py equivalent)
// ---------------------------------------------------------------------------

function extractFeatures(data) {
    const n = data.length;
    if (n === 0) {
        return {
            length: 0,
            bit_count: 0,
            byte_freq: new Array(256).fill(0),
            entropy: 0.0,
            checksum: 0,
            mean: 0.0,
            variance: 0.0,
            ngram_hash: new Array(64).fill(0)
        };
    }
    
    let bitCount = 0;
    const freq = new Array(256).fill(0);
    let checksum = 0;
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
        const b = data[i];
        checksum ^= b;
        sum += b;
        freq[b]++;
        
        let val = b;
        while (val > 0) {
            if (val & 1) bitCount++;
            val >>= 1;
        }
    }
    
    const byteFreq = freq.map(f => f / n);
    let entropySum = 0.0;
    for (let i = 0; i < 256; i++) {
        const f = byteFreq[i];
        if (f > 0.0) {
            entropySum += f * Math.log2(f);
        }
    }
    const entropyVal = -entropySum;
    
    const mean = sum / n;
    let varSum = 0;
    for (let i = 0; i < n; i++) {
        varSum += (data[i] - mean) ** 2;
    }
    const variance = varSum / n;
    
    const ngramHash = new Array(64).fill(0);
    if (n > 1) {
        for (let i = 0; i < n - 1; i++) {
            const pairVal = (data[i] << 8) | data[i + 1];
            const bucket = pairVal % 64;
            ngramHash[bucket] += 1.0;
        }
        const maxNgram = Math.max(...ngramHash) || 1.0;
        for (let i = 0; i < 64; i++) {
            ngramHash[i] /= maxNgram;
        }
    }
    
    return {
        length: n,
        bit_count: bitCount,
        byte_freq: byteFreq,
        entropy: entropyVal,
        checksum: checksum,
        mean: mean,
        variance: variance,
        ngram_hash: ngramHash
    };
}

function buildFeatureVector(features) {
    const n = features.length;
    const lengthNorm = Math.log1p(n) / Math.log1p(1000000);
    const bitNorm = n > 0 ? features.bit_count / (8 * n) : 0.0;
    const entropyNorm = features.entropy / 8.0;
    const checksumNorm = features.checksum / 255.0;
    const meanNorm = features.mean / 255.0;
    const varianceNorm = features.variance / (255.0 ** 2);
    
    const bf = features.byte_freq;
    const bf64 = [];
    for (let i = 0; i < 64; i++) {
        bf64.push(bf[i * 4] + bf[i * 4 + 1] + bf[i * 4 + 2] + bf[i * 4 + 3]);
    }
    
    const vector = [
        lengthNorm, bitNorm, entropyNorm, checksumNorm, meanNorm, varianceNorm,
        ...bf64,
        ...features.ngram_hash
    ];
    return vector.map(x => x === 0.0 ? 0.0 : x);
}

// ---------------------------------------------------------------------------
// Neural Parameter Generation (neural.py equivalent)
// ---------------------------------------------------------------------------

function sigmoid(x) {
    if (x >= 0) {
        return 1.0 / (1.0 + Math.exp(-x));
    } else {
        const ex = Math.exp(x);
        return ex / (1.0 + ex);
    }
}

function tanh(x) {
    return Math.tanh(Math.max(-500.0, Math.min(500.0, x)));
}

function dot(a, b) {
    let s = 0.0;
    for (let i = 0; i < a.length; i++) {
        s += a[i] * b[i];
    }
    return s;
}

function forward(vector, weightMatrix, activation) {
    const act = activation === "sigmoid" ? sigmoid : tanh;
    return weightMatrix.map(row => act(dot(row, vector)));
}

function deriveWeights(seedInt, rows, cols) {
    const a = 1664525;
    const c = 1013904223;
    const m = 4294967296; // 2**32
    let state = seedInt % m;
    const matrix = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let col = 0; col < cols; col++) {
            state = (a * state + c) % m;
            row.push((state / m) * 2.0 - 1.0);
        }
        matrix.push(row);
    }
    return matrix;
}

function generateParameters(featureVector) {
    let rawSeed = 0n;
    for (let i = 0; i < featureVector.length; i++) {
        const bits = getDoubleBits(featureVector[i]);
        rawSeed ^= bits * BigInt(i + 1);
    }
    rawSeed = rawSeed & 0xFFFFFFFFFFFFFFFFn;
    
    const seedLow32 = Number(rawSeed & 0xFFFFFFFFn);
    const seedHigh32 = Number((rawSeed >> 32n) & 0xFFFFFFFFn);
    
    const W1 = deriveWeights(seedLow32, 32, featureVector.length);
    const h1 = forward(featureVector, W1, "sigmoid");
    
    const W2 = deriveWeights(seedHigh32, 16, 32);
    const h2 = forward(h1, W2, "tanh");
    
    let seed = 0n;
    for (let i = 0; i < 8; i++) {
        const byteVal = BigInt(Math.floor(Math.abs(h2[i]) * 255) & 0xFF);
        seed = (seed << 8n) | byteVal;
    }
    
    const r_value = 3.57 + Math.abs(h2[8]) * 0.43;
    
    const rotations = [];
    for (let i = 0; i < 8; i++) {
        const rot = Math.floor(Math.abs(h2[i % 16]) * 62) + 1;
        rotations.push(rot % 64 || 1);
    }
    
    let compression_key = 0n;
    for (let i = 0; i < 8; i++) {
        const byteVal = BigInt(Math.floor(Math.abs(h1[i]) * 255) & 0xFF);
        compression_key = (compression_key << 8n) | byteVal;
    }
    
    const round_count = 4 + Math.floor(Math.abs(h2[9]) * 12);
    
    let permutation_seed = 0;
    for (let i = 0; i < 4; i++) {
        const byteVal = Math.floor(Math.abs(h1[8 + i]) * 255) & 0xFF;
        permutation_seed = (permutation_seed * 256) + byteVal;
    }
    
    return {
        seed,
        r_value,
        rotations,
        compression_key,
        round_count,
        permutation_seed
    };
}

// ---------------------------------------------------------------------------
// Chaotic Engine (chaos.py equivalent)
// ---------------------------------------------------------------------------

function logisticMap(x0, r, n) {
    let x = x0;
    for (let i = 0; i < 256; i++) {
        x = r * x * (1.0 - x);
    }
    const res = [];
    for (let i = 0; i < n; i++) {
        x = r * x * (1.0 - x);
        res.push(x);
    }
    return res;
}

function tentMap(x0, mu, n) {
    let x = x0;
    for (let i = 0; i < 256; i++) {
        x = mu * Math.min(x, 1.0 - x);
    }
    const res = [];
    for (let i = 0; i < n; i++) {
        x = mu * Math.min(x, 1.0 - x);
        res.push(x);
    }
    return res;
}

function henonMap(x0, y0, a, b, n) {
    let x = x0, y = y0;
    for (let i = 0; i < 256; i++) {
        let xNext = 1.0 - a * Math.pow(x, 2) + y;
        let yNext = b * x;
        if (Math.abs(xNext) > 1.5) {
            xNext = pythonModulo(xNext, 3.0) - 1.5;
        }
        if (Math.abs(yNext) > 0.5) {
            yNext = pythonModulo(yNext, 1.0) - 0.5;
        }
        x = xNext;
        y = yNext;
    }
    const res = [];
    for (let i = 0; i < n; i++) {
        let xNext = 1.0 - a * Math.pow(x, 2) + y;
        let yNext = b * x;
        if (Math.abs(xNext) > 1.5) {
            xNext = pythonModulo(xNext, 3.0) - 1.5;
        }
        if (Math.abs(yNext) > 0.5) {
            yNext = pythonModulo(yNext, 1.0) - 0.5;
        }
        x = xNext;
        y = yNext;
        res.push((Math.tanh(x) + 1.0) / 2.0);
    }
    return res;
}

function chaosSequenceToBytes(sequence, length) {
    const n = length || sequence.length;
    const res = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
        const v = sequence[i % sequence.length];
        res[i] = Math.floor(v * 256) % 256;
    }
    return res;
}

function generateChaosState(params, stateSize) {
    const seed = BigInt(params.seed);
    const r = params.r_value;
    
    const x0 = (Number(seed % 10000007n) / 10000007.0) * 0.998 + 0.001;
    const y0 = (Number((seed >> 16n) % 10000007n) / 10000007.0) * 0.998 + 0.001;
    
    const mapSelector = Number(seed % 3n);
    let sequence = [];
    
    if (mapSelector === 0) {
        sequence = logisticMap(x0, r, stateSize + 16);
    } else if (mapSelector === 1) {
        const mu = 1.99 + x0 * 0.01;
        sequence = tentMap(x0, mu, stateSize + 16);
    } else {
        sequence = henonMap(x0, y0, 1.4, 0.3, stateSize + 16);
    }
    
    return chaosSequenceToBytes(sequence, stateSize);
}

function mixStateWithChaos(state, chaosBytes) {
    for (let i = 0; i < state.length; i++) {
        state[i] ^= chaosBytes[i % chaosBytes.length];
    }
    return state;
}

// ---------------------------------------------------------------------------
// Permutation Engine (permutation.py equivalent)
// ---------------------------------------------------------------------------

function generatePermutationIndices(size, seed, chaosBytes) {
    const indices = Array.from({ length: size }, (_, i) => i);
    const n = chaosBytes.length;
    let state = (BigInt(seed) & 0xFFFFFFFFFFFFFFFFn) ^ readUint64BE(chaosBytes, 0);
    const a = 6364136223846793005n;
    const c = 1442695040888963407n;
    const m = 18446744073709551616n;
    
    for (let i = size - 1; i > 0; i--) {
        state = (a * state + c) % m;
        const chaosByte = n > 0 ? BigInt(chaosBytes[i % n]) : 0n;
        const j = Number((state ^ chaosByte) % BigInt(i + 1));
        const temp = indices[i];
        indices[i] = indices[j];
        indices[j] = temp;
    }
    return indices;
}

function permuteBits(state, params, chaosBytes) {
    const nBits = state.length * 8;
    const perm = generatePermutationIndices(nBits, params.permutation_seed, chaosBytes);
    
    const originalBits = [];
    for (let i = 0; i < state.length; i++) {
        const byte = state[i];
        for (let bitPos = 7; bitPos >= 0; bitPos--) {
            originalBits.push((byte >> bitPos) & 1);
        }
    }
    
    const newBits = new Array(nBits).fill(0);
    for (let src = 0; src < nBits; src++) {
        newBits[perm[src]] = originalBits[src];
    }
    
    for (let i = 0; i < state.length; i++) {
        let byteVal = 0;
        for (let bitPos = 0; bitPos < 8; bitPos++) {
            byteVal = (byteVal << 1) | newBits[i * 8 + bitPos];
        }
        state[i] = byteVal;
    }
    return state;
}

function permuteWords(state, params, chaosBytes) {
    const words = [];
    for (let i = 0; i < 8; i++) {
        words.push(readUint64BE(state, i * 8));
    }
    
    const rotations = params.rotations;
    const n = words.length;
    
    for (let i = 0; i < n; i++) {
        const rot = rotations[i % rotations.length];
        const chaosAdj = chaosBytes.length > 0 ? chaosBytes[i % chaosBytes.length] : 0;
        const effectiveRot = (rot + chaosAdj) % 64 || 1;
        words[i] = rotateLeft64(words[i], effectiveRot);
    }
    
    const perm = generatePermutationIndices(n, params.permutation_seed, chaosBytes);
    const shuffled = perm.map(idx => words[idx]);
    
    for (let i = 0; i < 8; i++) {
        writeUint64BE(state, i * 8, shuffled[i]);
    }
    return state;
}

function applyPermutation(state, params, chaosBytes) {
    state = permuteWords(state, params, chaosBytes);
    const core = new Uint8Array(state.subarray(0, 8));
    const subChaos = chaosBytes.subarray(0, 8);
    permuteBits(core, params, subChaos);
    state.set(core, 0);
    return state;
}

// ---------------------------------------------------------------------------
// Compression Engine (compression.py equivalent)
// ---------------------------------------------------------------------------

function generateSbox(chaosBytes) {
    const sbox = Array.from({ length: 256 }, (_, i) => i);
    if (!chaosBytes || chaosBytes.length === 0) {
        return sbox;
    }
    const n = chaosBytes.length;
    let state = readUint64BE(chaosBytes, 0);
    const a = 6364136223846793005n;
    const c = 1442695040888963407n;
    const m = 18446744073709551616n;
    
    for (let i = 255; i > 0; i--) {
        state = (a * state + c) % m;
        const chaosByte = BigInt(chaosBytes[i % n]);
        const j = Number((state ^ chaosByte) % BigInt(i + 1));
        const temp = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = temp;
    }
    return sbox;
}

function applySbox(state, sbox) {
    for (let i = 0; i < state.length; i++) {
        state[i] = sbox[state[i]];
    }
    return state;
}

function mixPair(a, b, rotation) {
    const a2 = (a + b) & 0xFFFFFFFFFFFFFFFFn;
    const b2 = (rotateLeft64(b, rotation) ^ a2) & 0xFFFFFFFFFFFFFFFFn;
    return [a2, b2];
}

function compressionRound(state, roundKey, rotations, sbox) {
    if (sbox) {
        applySbox(state, sbox);
    }
    
    const words = [];
    for (let i = 0; i < 8; i++) {
        words.push(readUint64BE(state, i * 8));
    }
    
    for (let i = 0; i < 8; i++) {
        const factor = BigInt(roundKey) * BigInt(i + 1);
        words[i] = words[i] ^ (factor & 0xFFFFFFFFFFFFFFFFn);
    }
    
    for (let i = 0; i < 8; i += 2) {
        const rot = rotations[Math.floor(i / 2) % rotations.length];
        const [a2, b2] = mixPair(words[i], words[i + 1], rot);
        words[i] = a2;
        words[i + 1] = b2;
    }
    
    for (let i = 0; i < 4; i++) {
        const rot = rotations[(i + 4) % rotations.length];
        const [a2, b2] = mixPair(words[i], words[i + 4], rot);
        words[i] = a2;
        words[i + 4] = b2;
    }
    
    for (let i = 0; i < 7; i++) {
        const rot = rotations[i % rotations.length];
        words[i + 1] = (words[i + 1] ^ rotateLeft64(words[i], rot)) & 0xFFFFFFFFFFFFFFFFn;
    }
    
    for (let i = 0; i < 8; i++) {
        writeUint64BE(state, i * 8, words[i]);
    }
    return state;
}

function initializeState(data, params) {
    const shaSeed = sha512(data);
    const key = BigInt(params.compression_key);
    
    const keyBytes = new Uint8Array(64);
    let tempKey = key;
    const key8 = new Uint8Array(8);
    for (let i = 7; i >= 0; i--) {
        key8[i] = Number(tempKey & 0xFFn);
        tempKey >>= 8n;
    }
    for (let i = 0; i < 64; i++) {
        keyBytes[i] = key8[i % 8];
    }
    
    const state = new Uint8Array(64);
    for (let i = 0; i < 64; i++) {
        state[i] = shaSeed[i] ^ keyBytes[i];
    }
    return state;
}

function compressState(state, params, chaosBytes) {
    const baseKey = BigInt(params.compression_key);
    const roundCount = params.round_count;
    const rotations = params.rotations;
    
    for (let rnd = 0; rnd < roundCount; rnd++) {
        const chaosOffset = rnd * 8;
        const chaosSlice = chaosBytes.subarray(chaosOffset, chaosOffset + 8);
        const chaosWord = readUint64BE(chaosSlice, 0);
        const roundKey = (baseKey ^ rotateLeft64(chaosWord, rnd * 7)) & 0xFFFFFFFFFFFFFFFFn;
        
        const sboxChaos = chaosBytes.subarray(chaosOffset, chaosOffset + 32);
        const sbox = generateSbox(sboxChaos);
        
        compressionRound(state, roundKey, rotations, sbox);
    }
    return state;
}

function extractDigest(state) {
    const folded = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        folded[i] = state[i] ^ state[i + 32];
    }
    
    const words = [];
    for (let i = 0; i < 4; i++) {
        words.push(readUint64BE(folded, i * 8));
    }
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            words[j + 1] = (words[j + 1] ^ rotateLeft64(words[j], 17 + j * 11)) & 0xFFFFFFFFFFFFFFFFn;
        }
    }
    
    const digestBytes = new Uint8Array(32);
    for (let i = 0; i < 4; i++) {
        writeUint64BE(digestBytes, i * 8, words[i]);
    }
    return digestBytes;
}

function finalizeDigest(state, data) {
    const raw = extractDigest(state);
    const n = data.length;
    const extConst = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        extConst[i] = (n >>> (i % 8)) & 0xFF;
    }
    if (data.length > 0) {
        extConst[0] ^= data[0];
        extConst[31] ^= data[data.length - 1];
    }
    
    const final = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        final[i] = raw[i] ^ extConst[i];
    }
    
    return Array.from(final).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// Public API Orchestrator (core.py equivalent)
// ---------------------------------------------------------------------------

function runPipeline(data) {
    const feats = extractFeatures(data);
    const vec = buildFeatureVector(feats);
    const params = generateParameters(vec);
    
    const chaosNeeded = 64 + params.round_count * 8;
    const chaosBytes = generateChaosState(params, chaosNeeded);
    
    const state = initializeState(data, params);
    
    applyPermutation(state, params, chaosBytes.subarray(0, 64));
    mixStateWithChaos(state, chaosBytes);
    compressState(state, params, chaosBytes);
    applyPermutation(state, params, chaosBytes.subarray(8));
    
    return finalizeDigest(state, data);
}

function hash(data) {
    return runPipeline(encode(data));
}

function verify(data, digest) {
    const expected = hash(data);
    return constantTimeCompare(expected, digest);
}

function hmac_anch(key, message) {
    const keyBytes = encode(key);
    const msgBytes = encode(message);
    const blockSize = 64;
    
    let kBytes = keyBytes;
    if (kBytes.length > blockSize) {
        const keyHex = hash(kBytes);
        kBytes = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }
    
    if (kBytes.length < blockSize) {
        const tmp = new Uint8Array(blockSize);
        tmp.set(kBytes, 0);
        kBytes = tmp;
    }
    
    const ipad = new Uint8Array(blockSize);
    const opad = new Uint8Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
        ipad[i] = kBytes[i] ^ 0x36;
        opad[i] = kBytes[i] ^ 0x5C;
    }
    
    const innerInput = new Uint8Array(blockSize + msgBytes.length);
    innerInput.set(ipad, 0);
    innerInput.set(msgBytes, blockSize);
    const innerHashHex = hash(innerInput);
    const innerHashBytes = new Uint8Array(innerHashHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    const outerInput = new Uint8Array(blockSize + innerHashBytes.length);
    outerInput.set(opad, 0);
    outerInput.set(innerHashBytes, blockSize);
    
    return hash(outerInput);
}

function hmac_anch_verify(key, message, mac) {
    const expected = hmac_anch(key, message);
    return constantTimeCompare(expected, mac);
}

// Module exports for Node and Browser
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = {
        hash,
        verify,
        hmac_anch,
        hmac_anch_verify,
        extractFeatures,
        buildFeatureVector,
        generateParameters,
        sha512
    };
} else if (typeof window !== "undefined") {
    window.anch = {
        hash,
        verify,
        hmac_anch,
        hmac_anch_verify
    };
}
