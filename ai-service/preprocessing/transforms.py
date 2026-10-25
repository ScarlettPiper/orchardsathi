"""
OrchardSathi AI — Image Preprocessing Pipeline
Prepares apple leaf images for Deep Learning Classification (PyTorch)
"""
try:
    from PIL import Image
    import torchvision.transforms as transforms
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    from PIL import Image

def get_inference_transforms():
    """
    Standard ImageNet / Transfer Learning input transforms:
    - Resize image to 256x256
    - Center crop to 224x224
    - Convert to Tensor
    - Normalize with ImageNet mean & standard deviation
    """
    if not TORCH_AVAILABLE:
        return None

    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

def preprocess_image(image_bytes):
    """
    Reads image bytes and prepares tensor or preprocessed PIL image.
    """
    import io
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    transform = get_inference_transforms()
    if transform:
        tensor = transform(image).unsqueeze(0) # Batch dimension [1, 3, 224, 224]
        return tensor, image
    return None, image
