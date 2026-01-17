// Configureaza aplicatia Express:
// - incarca variabilele de mediu
// - aplica middleware-uri globale
// - defineste health check
// - monteaza routerul principal
// - gestioneaza erorile

import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes/index.js';
import errorHandler from "./middlewares/errorHandler.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();
const app=express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || true,
    credentials: true,
}))

app.use(express.json());

app.get('/api/health', (req,res)=>res.status(200).json({ok: true}));

app.use('/api', router);
app.use("/api", commentRoutes);

app.use((req,res)=>{
    res.status(404).json({message: `Route ${req.method} ${req.originalUrl} not found`});
})

app.use(errorHandler);

export default app;