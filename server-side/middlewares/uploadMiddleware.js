import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb)=>{
    if(!file.mimetype.startsWith('image/')){
        cb(new Error("Only omage files allowed"),false);
    }
    cb(null,true);
};

export const upload = multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter,
});