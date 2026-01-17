// middleware de autentificare si autorizare: 
// - requireAuth: valideaza tokenul JWT si ataseaza utilizatorul in req.user
// - requireRole: verifica daca utilizatorul are un anumit rol intr-un proiect

import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const secret= process.env.JWT_SECRET;
if(!secret){
    throw new Error('JWT_SECRET is not defined')
}
const prisma= new PrismaClient();

// verifica daca cererea contine un JWT valid
export function requireAuth(req , res , next ){
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
        req.user=decoded; // ataseaza datele utilizatorului in req
        next();  // merge mai departe spre ruta solicitata
    } catch(err){
        return res.status(401).json({error: 'Invalid token'});
    }
}

//se foloseste doar in rute unde accesul depinde de rol
export function requireRole(role){
    return async(req, res, next) =>{
        try{
            const userId= req.user.id;

            const projectMember= await prisma.projectMember.findFirst({
                where: {
                    userId,
                    projectId: req.params.projectId,
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