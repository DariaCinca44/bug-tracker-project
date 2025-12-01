// acest fisier configureaza aplicatia Express: 
// - incarca variabilele
// - aplica middleware-uri globale precum CORS, JSON
// - defineste /api/health
// - conecteaza routerul principal
// - gestioneaza rutele inexistente
// - ataseaza handler-ul global de erori

import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app=express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || true,
    credentials: true,
}))

app.use(express.json());

app.get('/api/health', (req,res)=>res.status(200).json({ok: true}));

app.use('/api', router);

app.use((req,res)=>{
    res.status(404).json({message: `Route ${req.method} ${req.originalUrl} not found`});
})

app.use(errorHandler);

export default app;