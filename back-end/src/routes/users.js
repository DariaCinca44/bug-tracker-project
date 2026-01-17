// acest fisier contine rute pentru gestionarea contului utilizatorului autentificat:
// - obtinerea informatiilor despre propriul cont

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middlewares/authMiddlewares.js";

const prisma= new PrismaClient();
const router= Router();

// GET /users/me -> returneaza datele utilizatorului autentificat
    router
        .get('/me', requireAuth, async(req, res, next)=>{
            try{
                const userId = req.user.id;

                const user= await prisma.user.findUnique({
                    where: {id:userId},
                    select: {
                        id:true,
                        name:true,
                        email:true,
                        xp:true,
                        level:true,
                        createdAt: true,
                        memberships: {
                        include: {
                            project: true
                        }
                        }
                    }
                })
                if(!user){
                    throw{status: 404, message: 'User not found'};
                }
                
               res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                xp: user.xp,
                level: user.level,
                projects: user.memberships.map(m => m.project)
                });

            } catch(err){
                next(err);
            }
        })

export default router;