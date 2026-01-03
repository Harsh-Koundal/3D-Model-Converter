import Model3D from "../model/Model3D.js";
import { uploadImage } from "../services/cloudinaryService.js";
import { generate3DModel } from "../services/aiService.js";
import cloudinary from "../config/cloudinary.js";


export const generateModel = async (req, res) => {
    try {
        const imageUpload = await uploadImage(req.file.buffer);

        const modelDoc = await Model3D.create({
            userId: req.user.id,
            inputImage: {
                url: imageUpload.secure_url,
                publicId: imageUpload.public_id,
            },
        });

        const aiResult = await generate3DModel(imageUpload.secure_url);

        const modelUpload = await cloudinary.uploader.upload(aiResult.model_path, {
            resource_type: "raw",
            folder: "picto3d/models",
        });

        modelDoc.status = "completed";
        await modelDoc.save();

        return res.status(201).json({ message: "Model generated successfully", modelUrl: modelUpload.secure_url });
    } catch (err) {
        console.error("error occured :", err);
        return res.status(500).json({
            success: false,
            message: "3D generation failed",
        });
    }
}