import express from 'express';
import { generateModel } from '../controllers/modelController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post("/generate",upload.single("image"),generateModel);

export default router;