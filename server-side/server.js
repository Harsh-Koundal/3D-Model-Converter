import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5025",
];

app.use(
    cors({
        origin: (origin, callback) =>{
            if(!origin || allowedOrigins.includes(origin)){
                callback(null,true);
            }else{
                console.error("Bocked by CORS:",origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials:true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],    
    })
);

connectDB();

const PORT = process.env.PORT || 5025;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});