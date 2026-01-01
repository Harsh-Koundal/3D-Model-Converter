import axios from "axios";
import Image from "../model/Image.js"

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const saved = await Image.create({
        url: file.path,
        public_id: file.filename,
        modelUrl: null,
        status: "processing"
    });

    // Send Cloudinary URL to Python AI
    axios.post("http://127.0.0.1:8000/generate-model", {
      image_url: file.path,
      model_id: saved._id
    }).then(async (aiRes) => {
        await Image.findByIdAndUpdate(saved._id, {
            modelUrl: aiRes.data.model_url,
            status: "completed"
        });
    });

    return res.json({
      message: "Image uploaded, generating 3D model...",
      id: saved._id
    });

  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

export const getModel = async (req, res) => {
  try {
    const item = await Image.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Model not found" });

    return res.json({
      status: item.status,
      modelUrl: item.modelUrl,
      imageUrl: item.url,
      createdAt: item.createdAt
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
