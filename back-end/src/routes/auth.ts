// acest fisier contine rute pentru autentificare si gestionarea propriului cont:
// - /auth/register -> creare cont nou
// - /auth/login -> autentificare si generare JWT

import { Router } from "express";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma=new PrismaClient();
const router= Router();

const secret= process.env.JWT_SECRET!;


// REGISTER - valideaza datele primite, verifica unicitatea emailului, hash-uieste parola, salveaza userul in BD
router
    .post('/register', async(req,res,next) =>{
    try{
        const {email,password,name} = req.body;

        if(!email || !password || !name){
            throw{status: 400, message: 'Email, password and name are mandatory!'};
        }

        const exists= await prisma.user.findUnique({where: {email}});
        if(exists){
            throw{status:409, message: 'Email already registered'};
        } 
        
        const hashed= await bcrypt.hash(password,10);

        const user= await prisma.user.create({
            data: {
                email,
                name,
                passwordHash: hashed
            }
        })

        res.status(201).json({message: 'User created!', user}); 
    } catch (err){
        next(err);
    }
})

// LOGIN - verifica existenta userului, verifica parola, genereaza token JWT valabil o zi

    .post('/login', async(req,res,next)=>{
    try{
        const {email, password} = req.body;

        const user= await prisma.user.findUnique({where: {email}});
        if(!user){
            throw{status: 404, message: 'Account does not exist'};
        }

        const valid= await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            throw{status: 401, message: 'Invalid password'};
        }

        // token ce contine id+email , folosit pentru autorizare
        const token = jwt.sign( 
            {id: user.id, email: user.email}, 
            secret,
            {expiresIn: '1d'}
        )

        res.json({message: 'Authenticated!', token});
    } catch(err){
        next(err);
    }
    })

export default router;