import cloudinary from "../config/cloudinary.js";

export const uploadImage = async(buffer)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream(
            {folder:"picto#d/images"},
            (error,result)=>{
                if(error) reject(error);
                resolve(result);
            }
        ).end(buffer);
    });
};