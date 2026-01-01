import cloudinary from "../config/cloudinary.js";
import Image from "../model/Image.js";

export const uploadImage = async(req,res)=>{
    try{
        const file = req.file;

        if(!file) return res.status(400).json({message:"No file uploaded"});

        const image = await Image.create({
            url:file.path,
            public_id:file.fileName,
        });

        return res.status(200).json({
            success:true,
            message:"Image uploaded successfully",
            data:image,
        });
    }catch(err){
        console.error("error uploading image:",err);
        return res.status(500).json({message:"Error uploading image:",err});
    }
};
