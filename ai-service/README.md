# OrchardSathi AI — Python Deep Learning Microservice

FastAPI microservice for apple leaf pathology classification in Kashmir orchards.

## Supported Disease Classes
1. **Apple Scab** (*Venturia inaequalis*)
2. **Black Rot** (*Botryosphaeria obtusa*)
3. **Cedar Apple Rust** (*Gymnosporangium juniperi-virginianae*)
4. **Healthy Leaf** (*Malus domestica foliage*)

## Architecture
- **Framework:** FastAPI with Uvicorn ASGI server
- **Deep Learning Engine:** PyTorch (`torch`, `torchvision`)
- **Neural Network Backbone:** MobileNetV3-Small / ResNet-18 fine-tuned for 4-class classification
- **Input Specs:** 224x224 RGB normalized tensors

## Setup Instructions

1. Ensure Python 3.10+ is installed:
   ```bash
   python --version
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Place trained PyTorch weights:
   Place your trained `.pth` weights file at:
   `ai-service/model/apple_leaf_model.pth`

   If no weights file is present, the microservice runs in diagnostic mode with transparent notice.

5. Start the microservice:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

6. Interactive Swagger Documentation:
   Visit `http://localhost:8000/docs` in your browser.
