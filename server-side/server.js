import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import limiter from './middlewares/ratelimitMiddleware.js';

import { connectDB } from './config/db.js';
import modelRoutes from './routes/modelRoutes.js';
import { model } from 'mongoose';

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

app.use(express.json());
app.use(limiter);

// routes

app.use('/api/model',modelRoutes);


connectDB();

const PORT = process.env.PORT || 5025;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});