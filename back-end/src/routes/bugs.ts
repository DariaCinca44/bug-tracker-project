// acest fisier contine rute pentru gestionarea bug-urilor:
// - crearea unui bug de catre TST
// - listarea bug-urilor intr-un proiect
// - asignarea unui bug ca MP
// - schimbarea statusului unui bug ca MP
// - editarea detaliilor unui bug ca MP/TST

import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddlewares";
import { PrismaClient, BugStatus } from "@prisma/client";

const prisma= new PrismaClient();
const router= Router();

// REPORT BUG -> doar TST din proiect
router
    .post('/projects/:projectId/bugs', requireAuth, async (req: any, res, next) =>{
        try{
            const {projectId} = req.params;
            const userId = req.user.id;
            const {title, description, severity, priority} = req.body;

            if(!title || !description || !severity || !priority){
               throw {status: 400, message: 'All fields are mandatory'};
            }
            
            const member= await prisma.projectMember.findFirst({
                where: {projectId, userId, role: 'TST'}
            })

            if(!member){
                throw {status: 403, message: 'Only TST users can report bugs'};
            }

            const bug= await prisma.bug.create({
                data: {
                    title,
                    description,
                    severity,
                    priority,
                    projectId,
                    reporterId: userId
                }
            })
            res.status(201).json(bug);
        }catch(err){
            next(err);
        }       
    })

// GET BUGS -> din proiecte, ca MP/TST

    .get('/projects/:projectId/bugs', requireAuth, async (req: any, res, next)=>{
        try{
            const {projectId} = req.params;
            const {status} = req.query;
            const userId= req.user.id;

            const memberProject= await prisma.projectMember.findFirst({
                where: {projectId, userId}
            })

            if(!memberProject){
                throw {status: 403, message: 'You do not have access to this project'};
            }

            const bugs = await prisma.bug.findMany({
                where: status ? {projectId, status: status as BugStatus} : {projectId},
                orderBy: {createdAt: "desc"}
            })
            res.json(bugs);
        } catch (err){
            next(err);
        }
    })

// ASSIGN BUG -> doar MP 

    .patch('/:bugId/assign', requireAuth, async (req: any, res, next)=>{
        try{
            const {bugId} = req.params;
            const userId= req.user.id;

            const bug = await prisma.bug.findUnique({where : {id: bugId}});
            if(!bug){
                throw {status: 404, message: 'Bug not found'};
            }

            const member= await prisma.projectMember.findFirst({
                where: {projectId: bug.projectId, userId, role: 'MP'}
            })
            if(!member){
                throw {status: 403, message: 'Only MPs can assign bugs'};
            }

            const updated= await prisma.bug.update({
                where: {id: bugId},
                data: {
                    assignedId: userId,
                    status: 'IN_PROGRESS'
                }
            })
            res.json(updated);
        }catch(err){
            next(err);
        }
    })

// UPDATE STATUS  -> doar MP

    .patch('/:bugId/status', requireAuth, async (req: any, res, next)=>{
        try{
            const {bugId} = req.params;
            const {status, commitUrl} = req.body;
            const userId = req.user.id;

            const bug= await prisma.bug.findUnique({
                where: {id: bugId}
            })
            if(!bug){
                throw{status: 404, message: 'Bug not found'};
            }

            const member= await prisma.projectMember.findFirst({
                where: {userId, projectId: bug.projectId, role: 'MP'}
            })
            if(!member){
                throw{ status: 403, message: 'Only MPs can update bug status'};
            }

            if(status == 'RESOLVED'){
                if(!commitUrl || !commitUrl.startsWith ('https://github.com/')){
                    throw{status: 400, message: 'RESOLVED requires a valid GitHub commit URL'};
                }
            }

            const updated = await prisma.bug.update({
                where: {id: bugId},
                data: {
                    status,
                    commitUrl: commitUrl || null
                }
            })
            res.json(updated);
        }catch(err){
            next(err);
        }
    })

// UPDATE DETAILS -> TST/MP updateaza informatiile bug-ului

    .patch('/:bugId', requireAuth, async(req: any, res, next)=>{
        try{
            const {bugId} = req.params;
            const {title, description, severity, priority} = req.body;
            const userId= req.user.id;

            const bug= await prisma.bug.findUnique({
                where: {id:bugId}
            })
            if(!bug){
                throw{status: 404, message: 'Bug not found'};
            }

            const member= await prisma.projectMember.findFirst({
                where: {userId, projectId: bug.projectId}
            })
            if(!member){
                throw {status: 403, message: 'You are not a member of this project'};
            }

            const updated= await prisma.bug.update({
                where: {id: bugId},
                data:{
                    title,
                    description,
                    severity,
                    priority
                }
            })
            res.json(updated);
        }catch(err){
            next(err);
        }
    })

export default router;