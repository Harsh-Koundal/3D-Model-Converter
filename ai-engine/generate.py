import os
import torch
from PIL import Image
import requests
from io import BytesIO
import subprocess
import trimesh

PIFU_DIR = "./models/pifuhd"
CHECKPOINT = f"{PIFU_DIR}/checkpoints/pifuhd.pt"
OUTPUT_DIR = "./output"

def download_image(url, filename="input.jpg"):
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    path = f"{OUTPUT_DIR}/{filename}"
    img.save(path)
    return path


def generate_3d_from_image(image_url, name="model"):
    input_path = download_image(image_url)
    output_obj = f"{OUTPUT_DIR}/{name}.obj"
    output_glb = f"{OUTPUT_DIR}/{name}.glb"

    # 🔥 Run PIFuHD to generate OBJ
    subprocess.run([
        "python",
        f"{PIFU_DIR}/apps/simple_test.py",
        "-i", input_path,
        "-o", OUTPUT_DIR,
        "-c", CHECKPOINT
    ])

    # Locate generated OBJ (usually saved inside output/pifuhd_output/)
    for file in os.listdir(OUTPUT_DIR):
        if file.endswith(".obj"):
            output_obj = os.path.join(OUTPUT_DIR, file)

    # 🔥 Convert OBJ → GLB
    mesh = trimesh.load(output_obj)
    mesh.export(output_glb)

    return output_glb
