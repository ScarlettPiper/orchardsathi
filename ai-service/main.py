"""
OrchardSathi AI — Python FastAPI Deep Learning Microservice
Apple Leaf Pathology Prediction API for Kashmir Orchards
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io

from model.classifier import AppleLeafClassifier, CLASSES, SCIENTIFIC_NAMES
from preprocessing.transforms import preprocess_image

app = FastAPI(
    title="OrchardSathi AI — Leaf Pathology Microservice",
    description="Deep Learning microservice for apple leaf disease detection in Kashmir orchards",
    version="1.0.0"
)

# Enable CORS for Express backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Classifier Model
classifier = AppleLeafClassifier()

@app.get("/")
def read_root():
    return {
        "service": "OrchardSathi AI Microservice",
        "status": "ONLINE",
        "tagline": "Smarter Orchards, Healthier Harvests.",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "supportedClasses": CLASSES,
        "weightsLoaded": classifier.is_weights_loaded,
        "device": classifier.device,
        "modelStatus": "PyTorch Fine-Tuned Model" if classifier.is_weights_loaded else "Diagnostic Heuristic Pipeline (Weights not attached)"
    }

@app.get("/classes")
def get_supported_classes():
    return {
        "classes": [
            {
                "name": c,
                "scientificName": SCIENTIFIC_NAMES.get(c, ""),
                "description": f"Temperate orchard foliar condition affecting Malus domestica in Kashmir."
            }
            for c in CLASSES
        ]
    }

@app.post("/predict")
async def predict_leaf_disease(file: UploadFile = File(...)):
    """
    Accepts an apple leaf image file (JPEG/PNG),
    performs preprocessing and returns deep learning classification.
    """
    # Validate content type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG).")

    try:
        contents = await file.read()
        tensor, pil_image = preprocess_image(contents)

        result = classifier.predict(tensor, filename=file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failure: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
