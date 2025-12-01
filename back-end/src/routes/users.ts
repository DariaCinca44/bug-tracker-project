//acest fisier contine rute pentru gestionarea contului utilizatorului autentificat
// - GET /users/me -> obtine informatii despre propriul cont
// - PATCH /users/me -> actualizeaza nume/email/parola
// - DELETE /users/me -> sterge propriul cont

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { requireAuth } from "../middlewares/authMiddlewares";

const prisma= new PrismaClient();
const router= Router();

// GET /users/me -> returneaza datele utilizatorului autentificat
    router
        .get('/me', requireAuth, async(req: any, res, next)=>{
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
                        createdAt: true
                    }
                })
                if(!user){
                    throw{status: 404, message: 'User not found'};
                }
                
                res.json(user);
            } catch(err){
                next(err);
            }
        })

// PATCH /users/me -> actualizare nume, email si parola
        .patch('/me', requireAuth, async (req:any, res, next)=>{
            try{
                const userId= req.user.id;
                const {name, email, password} = req.body;

                if(!name && !email && !password){
                    throw {status: 400, message: 'Nothing to update'};
                }

                const updateData : any ={};

                if(name !== undefined){
                    updateData.name=name;
                }

                if(email!==undefined){
                    const exists = await prisma.user.findUnique({
                        where: {email}
                    })
                    if(exists && exists.id !== userId){
                        throw{status: 409, message: 'Email already used'}
                    }
                    updateData.email=email;
                }

                if(password !== undefined){
                    if(password.length <6){
                        throw{status: 400, message: 'Password must be at least 6 characters'};
                    }
                    updateData.passwordHash = await bcrypt.hash(password,10);
                }

                const updated= await prisma.user.update({
                    where: {id: userId},
                    data: updateData,
                    select :{
                        id:true,
                        name:true,
                        email:true,
                        xp:true,
                        level:true
                    }
                })
                res.json({message: 'User updated', user: updated});
            }catch(err){
                next(err);
            }
        })

// DELETE /users/me -> sterge propriul cont
        .delete('/me', requireAuth, async(req: any, res, next)=>{
            try{
                const userId= req.user.id;

                await prisma.user.delete({
                    where :{id: userId}
                })

                res.json({message: 'User deleted successfully'});
            }catch(err){
                next(err);
            }
        })

export default router;