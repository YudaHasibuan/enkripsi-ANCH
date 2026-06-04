"""
ANCH REST API Server
===================
Provides HTTP REST endpoints for hashing, verification, avalanche analysis,
entropy calculations, and performance benchmarks.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import time

import anch
from anch import feature, neural
from anch.benchmark import BenchmarkSuite

app = FastAPI(
    title="ANCH adaptif neural chaotic hashing API",
    description="REST API endpoints for the experimental ANCH Hashing framework.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class HashRequest(BaseModel):
    data: str = Field(..., description="String data to hash")

class HashResponse(BaseModel):
    digest: str = Field(..., description="256-bit hexadecimal hash digest")
    input_length: int = Field(..., description="Input length in bytes")
    time_taken_ms: float = Field(..., description="Time taken to compute the hash in milliseconds")
    feature_vector: List[float] = Field(..., description="134-dimensional feature vector extracted from the data")
    features_summary: Dict[str, float] = Field(..., description="Summary statistics of the extracted features")
    neural_params: Dict[str, Any] = Field(..., description="Neural-derived chaotic control parameters")

class VerifyRequest(BaseModel):
    data: str = Field(..., description="Input string to verify")
    digest: str = Field(..., description="Expected 64-character hex digest")

class VerifyResponse(BaseModel):
    verified: bool = Field(..., description="True if the computed digest matches the expected digest")

class AvalancheRequest(BaseModel):
    data_a: str = Field(..., description="First input string")
    data_b: str = Field(..., description="Second input string (ideally 1-bit or 1-char difference)")

class AvalancheResponse(BaseModel):
    avalanche_percentage: float = Field(..., description="Percentage of bits that differ between the two digests")
    digest_a: str = Field(..., description="Digest of first input")
    digest_b: str = Field(..., description="Digest of second input")
    bit_differences: int = Field(..., description="Total number of differing bits out of 256")

class EntropyRequest(BaseModel):
    digest: str = Field(..., description="64-character hex digest to analyze")

class EntropyResponse(BaseModel):
    entropy: float = Field(..., description="Shannon entropy score in bits per byte (ideal is 8.0)")

class BenchmarkRequest(BaseModel):
    samples: int = Field(default=50, ge=5, le=500, description="Number of samples to run for the benchmark")

class HmacRequest(BaseModel):
    key: str = Field(..., description="Secret key for HMAC")
    message: str = Field(..., description="Message payload to authenticate")

class HmacResponse(BaseModel):
    mac: str = Field(..., description="64-character hexadecimal HMAC-ANCH digest")
    time_taken_ms: float = Field(..., description="Time taken to compute the HMAC in milliseconds")

class HmacVerifyRequest(BaseModel):
    key: str = Field(..., description="Secret key for HMAC")
    message: str = Field(..., description="Message payload")
    mac: str = Field(..., description="Expected 64-character hexadecimal HMAC-ANCH digest")

class HmacVerifyResponse(BaseModel):
    verified: bool = Field(..., description="True if the computed HMAC matches the expected HMAC")

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def read_root():
    return {
        "status": "online",
        "framework": "ANCH (Adaptive Neural Chaotic Hash)",
        "version": "1.0.0",
        "endpoints": [
            "POST /hash",
            "POST /verify",
            "POST /avalanche",
            "POST /entropy",
            "POST /benchmark",
            "POST /hmac",
            "POST /hmac/verify"
        ]
    }

@app.post("/hash", response_model=HashResponse)
def hash_data(req: HashRequest):
    try:
        t0 = time.perf_counter()
        raw_bytes = req.data.encode("utf-8")
        
        # Calculate digest
        digest = anch.hash(raw_bytes)
        t1 = time.perf_counter()
        
        # Extract features and neural parameters for debug info
        feats = feature.extract_features(raw_bytes)
        vec = feature.build_feature_vector(feats)
        params = neural.generate_parameters(vec)
        
        # Summarize features
        feats_summary = {
            "mean": sum(vec) / len(vec) if vec else 0.0,
            "variance": sum((x - (sum(vec)/len(vec)))**2 for x in vec) / len(vec) if vec else 0.0,
            "non_zero_count": sum(1 for x in vec if abs(x) > 1e-9)
        }
        
        # Convert neural params to JSON serializable forms if needed
        # (rotations list, seed int, r_value float, etc are already serializable)
        serializable_params = {
            "seed": str(params["seed"]), # convert 64-bit int to string to avoid JS overflow
            "r_value": params["r_value"],
            "rotations": params["rotations"],
            "compression_key": str(params["compression_key"]),
            "round_count": params["round_count"],
            "permutation_seed": params["permutation_seed"]
        }
        
        return HashResponse(
            digest=digest,
            input_length=len(raw_bytes),
            time_taken_ms=(t1 - t0) * 1000,
            feature_vector=vec,
            features_summary=feats_summary,
            neural_params=serializable_params
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify", response_model=VerifyResponse)
def verify_data(req: VerifyRequest):
    try:
        is_valid = anch.verify(req.data, req.digest)
        return VerifyResponse(verified=is_valid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/avalanche", response_model=AvalancheResponse)
def analyze_avalanche(req: AvalancheRequest):
    try:
        pct = anch.avalanche(req.data_a, req.data_b)
        digest_a = anch.hash(req.data_a)
        digest_b = anch.hash(req.data_b)
        
        # Calculate bit differences
        bytes_a = bytes.fromhex(digest_a)
        bytes_b = bytes.fromhex(digest_b)
        diff_bits = sum(bin(ba ^ bb).count("1") for ba, bb in zip(bytes_a, bytes_b))
        
        return AvalancheResponse(
            avalanche_percentage=pct,
            digest_a=digest_a,
            digest_b=digest_b,
            bit_differences=diff_bits
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/entropy", response_model=EntropyResponse)
def calculate_entropy(req: EntropyRequest):
    try:
        score = anch.entropy(req.digest)
        return EntropyResponse(entropy=score)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/benchmark")
def run_benchmark(req: BenchmarkRequest):
    try:
        suite = BenchmarkSuite(samples=req.samples)
        report = suite.run_all()
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/hmac", response_model=HmacResponse)
def compute_hmac(req: HmacRequest):
    try:
        t0 = time.perf_counter()
        mac = anch.hmac_anch(req.key, req.message)
        t1 = time.perf_counter()
        return HmacResponse(
            mac=mac,
            time_taken_ms=(t1 - t0) * 1000
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/hmac/verify", response_model=HmacVerifyResponse)
def verify_hmac(req: HmacVerifyRequest):
    try:
        is_valid = anch.hmac_anch_verify(req.key, req.message, req.mac)
        return HmacVerifyResponse(verified=is_valid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
