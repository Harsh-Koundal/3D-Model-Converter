from fastapi import FastAPI
from pydantic import BaseModel
from generate import generate_3d_from_image
import cloudinary.uploader as uploader
import cloudinary
import os

cloudinary.config(
    cloud_name=os.getenv("dmeg0vqb8"),
    api_key=os.getenv("92968176516288"),
    api_secret=os.getenv("KT7daAv4rN8jBLzhXSFnsP2Mi-U")
)

class ImageRequest(BaseModel):
    image_url: str
    model_id: str  # unique id sent from Node

app = FastAPI()

@app.post("/generate-model")
async def generate(data: ImageRequest):
    glb_path = generate_3d_from_image(data.image_url, name=data.model_id)

    # Upload .glb → Cloudinary
    uploaded = uploader.upload(
        glb_path,
        resource_type="raw",
        folder="3d-model-converter/models"
    )

    model_url = uploaded["secure_url"]

    return {
        "status": "completed",
        "model_url": model_url
    }
