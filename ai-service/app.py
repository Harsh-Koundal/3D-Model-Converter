from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from worker import generate_3d_from_image

app = FastAPI(title="PicTo3D AI Service")


class GenerateRequest(BaseModel):
    image_url: HttpUrl


class GenerateResponse(BaseModel):
    model_path: str


@app.post("/generate", response_model=GenerateResponse)
def generate_model(req: GenerateRequest):
    try:
        model_path = generate_3d_from_image(req.image_url)
        return {"model_path": model_path}

    except RuntimeError as e:
        # Controlled errors (TripoSR failed)
        raise HTTPException(status_code=500, detail=str(e))

    except Exception:
        # Never leak raw binary / internal errors
        raise HTTPException(
            status_code=500,
            detail="Internal AI service error"
        )
