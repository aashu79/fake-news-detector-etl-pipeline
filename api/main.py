from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from typing import Dict
from config import MODEL_PATH
from setfit import SetFitModel
import torch
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Fake News Detector API",
    description="API for detecting fake news using SetFit MiniLM model.",
    version="1.0.0",
)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Models
class NewsItem(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    status: str
    message: str = None

# Global model variable
model: SetFitModel = None
device = "cuda" if torch.cuda.is_available() else "cpu"


@app.on_event("startup")
async def load_model():
    """Load the latest SetFit model on startup"""
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError(f"Model not found at {MODEL_PATH}")

        model = SetFitModel.from_pretrained(MODEL_PATH)
        model.to(device)
        logger.info(f"SetFit model loaded successfully on {device}")

    except Exception as e:
        logger.error(f"Failed to load SetFit model: {e}")
        raise RuntimeError(f"Failed to load SetFit model: {e}")


@app.post("/predict", response_model=PredictionResponse)
def predict(item: NewsItem):
    global model

    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    if not item.text or len(item.text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Text input too short for prediction. Minimum 10 characters required."
        )

    try:
        # Encode with sentence transformer body
        embeddings = model.model_body.encode([item.text])

        # Use sklearn head to predict probabilities
        probs = model.model_head.predict_proba(embeddings)

        predicted_class = int(np.argmax(probs))
        confidence = float(probs[0][predicted_class])

        fake_prob = float(probs[0][0])
        real_prob = float(probs[0][1])
        result = "Real" if predicted_class == 1 else "Fake"

        # Confidence levels
        if confidence >= 0.95:
            status = "very_high"
            message = f"Very highly confident this is {result} news"
        elif confidence >= 0.90:
            status = "high"
            message = f"Highly confident this is {result} news"
        elif confidence >= 0.80:
            status = "medium"
            message = f"Likely {result} news"
        elif confidence >= 0.70:
            status = "low"
            message = f"Somewhat likely {result} news - verify manually"
        else:
            status = "very_low"
            message = "Very low confidence - please verify manually or provide more context"

        logger.info(f"Prediction: {result} (confidence: {confidence:.4f})")

        return PredictionResponse(
            prediction=result,
            confidence=round(confidence, 4),
            probabilities={
                "fake": round(fake_prob, 4),
                "real": round(real_prob, 4)
            },
            status=status,
            message=message
        )

    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "OK",
        "message": "Fake News Detector API (SetFit) is running",
        "version": "1.0.0"
    }


@app.get("/model/info", tags=["Model"])
def model_info():
    global model
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    return {
        "model_type": "SetFit (MiniLM)",
        "model_loaded": True,
        "device": device
    }


def main():
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
