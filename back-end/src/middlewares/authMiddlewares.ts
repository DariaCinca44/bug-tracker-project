// middleware de autentificare si autorizare: 
// - requireAuth: valideaza tokenul JWT si ataseaza utilizatorul in req.user
// - requireRole: verifica daca utilizatorul are rolul MP/TST in proiect

import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const secret= process.env.JWT_SECRET!;
const prisma= new PrismaClient();

// verifica daca cererea contine un JWT valid
export function requireAuth(req: Request, res: Response, next: NextFunction){
    const authHeader= req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'Missing Authorization header'});
    }
    if(!authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'Invalid Authorization format'})
    }

    const token= authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(token,secret); // verifica tokenul
        (req as any).user=decoded; // ataseaza datele utilizatorului in req
        next();  // merge mai departe spre ruta solicitata
    } catch(err){
        return res.status(401).json({error: 'Invalid token'});
    }
}

//se foloseste doar in rute unde accesul depinde de rol
export function requireRole(role: 'MP' | 'TST'){
    return async(req: any, res: any, next: any) =>{
        try{
            const userId= req.user.id;

            const projectMember= await prisma.projectMember.findFirst({
                where: {
                    userId,
                    role
                }
            })

            if(!projectMember){
                return res.status(403).json({error: `Access denied. Only ${role} allowed.`});
            }
            next();
        } catch(err){
            console.log(err);
            res.status(500).json({error: 'Server error (role check)'});
        }
    }
}