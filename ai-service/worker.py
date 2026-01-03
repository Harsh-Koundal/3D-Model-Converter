import os
import uuid
import subprocess
import requests

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

TRIPO_ROOT = os.path.abspath("tripo")
RUN_SCRIPT = os.path.join(TRIPO_ROOT, "run.py")


def generate_3d_from_image(image_url: str) -> str:
    model_id = str(uuid.uuid4())

    input_image = os.path.join(OUTPUT_DIR, f"{model_id}.png")
    output_dir = os.path.join(OUTPUT_DIR, model_id)

    os.makedirs(output_dir, exist_ok=True)

    print("🔹 TRIPO_ROOT:", TRIPO_ROOT)
    print("🔹 RUN_SCRIPT:", RUN_SCRIPT)

    # 1️⃣ Download image
    response = requests.get(image_url, timeout=30)
    response.raise_for_status()

    with open(input_image, "wb") as f:
        f.write(response.content)

    print("✅ Image downloaded:", input_image)

    # 2️⃣ Build command (LOG IT)
    command = [
        "python",
        "run.py",
        "--image",
        input_image,
        "--output_dir",
        output_dir,
    ]

    print("🚀 Running command:", " ".join(command))

    result = subprocess.run(
        command,
        cwd=TRIPO_ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    print("🟡 STDOUT:\n", result.stdout.decode("utf-8", errors="ignore"))
    print("🔴 STDERR:\n", result.stderr.decode("utf-8", errors="ignore"))

    if result.returncode != 0:
        raise RuntimeError("TripoSR process failed (see logs above)")

    # 3️⃣ Find generated mesh
    for file in os.listdir(output_dir):
        if file.endswith(".obj") or file.endswith(".glb"):
            model_path = os.path.join(output_dir, file)
            print("✅ Model generated:", model_path)
            return model_path

    raise RuntimeError("TripoSR ran but no model file was produced")
