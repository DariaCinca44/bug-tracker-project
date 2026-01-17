// acest fisier contine rute pentru gestionarea notificarilor utilizatorului:
// - afisarea notificarilor necitite
// - marcarea unei notificari ca fiind citita

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middlewares/authMiddlewares.js";

const prisma = new PrismaClient();
const router = Router();

//GET -> afiseaza notificarile pentru utilizatorul curent
router
    .get('/', requireAuth, async( req, res, next)=>{
        try{
            const userId= req.user.id;

            const notifications = await prisma.notification.findMany({
                where:{userId, readAt: null},
                orderBy: {createdAt: "desc"}
            })
            res.json(notifications);
        }catch(err){
            next(err);
        }
    })

// PATCH -> marcheaza notificarile ca si vizualizate
    .patch('/:id/read', requireAuth, async (req,res,next)=>{
        try{
            const {id} = req.params;
            const userId = req.user.id;

            const notification = await prisma.notification.findUnique({
                where: {id}
            })
            if(!notification){
                throw{status: 404, message: 'Notification not found'}
            }

            if(notification.userId !== userId){
                throw {status: 403, message: 'Access denied'}
            }

            const updated= await prisma.notification.update({
                where: {id},
                data:{
                    readAt: new Date()
                }
            })
            res.json(updated);
        } catch(err){
            next(err);
        }
    })

export default router;