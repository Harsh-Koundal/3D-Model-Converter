import rateLimit from "express-rate-limit";
import { success } from "zod";

const limiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        success:false,
        message:"Too many request, please try again later.",
    },
});

export default limiter