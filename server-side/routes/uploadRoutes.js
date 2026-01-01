import express from 'express';
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { uploadImage,getModel } from '../controllers/uploadController.js';

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"3d-model-converter/images",
        allowed_formats:["jpg","jpeg","png"]
    }
});

const upload = multer({storage});

router.post("/",upload.single("image"),uploadImage);

router.get("/:id", getModel);

export default router