// acest fisier contine rute pentru managementul proiectelor:
// - POST /projects -> crearea unui proiect nou (userul va deveni automat MP)
// - POST /projects/:id/join -> userul se alatura ca TST
// - PATCH /projects/:id -> MP actualizeaza datele proiectului
// - DELETE /projects/:id -> MP sterge proiectul

import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/authMiddlewares";
import { PrismaClient } from "@prisma/client";

const router= Router();
const prisma= new PrismaClient();

//CREATE PROJECT -> orice user logat, devine automat MP in proiectul creat
router
    .post('/', requireAuth, async(req: any,res, next)=>{
    try{
        const {name, description, repoUrl } = req.body;

        if(!name || !repoUrl){
            throw {status: 400, message: 'Name and repoURL are mandatory'}
        }

        const user= (req as any).user;
        const project = await prisma.project.create({
            data:{
                name,
                description,
                repoUrl,
                createdById: user.id
            }
        })

        //adaugarea automata ca MP in proiectul creat
        await prisma.projectMember.create({
            data:{
                userId: user.id,
                projectId: project.id,
                role:'MP'
            }
        })

        res.status(201).json({message: 'Project created', project});
    }catch(err){
       next(err);
    }
})

//JOIN -> userul intra in proiect ca TST

    .post('/:id/join', requireAuth, async (req :any, res, next)=>{
        try{
            const {id} = req.params;
            const userId = req.user.id;

            const project = await prisma.project.findUnique({
                where: {id}
            })
            if(!project){
                throw{status: 404, message: 'Project not found'}
            }

            const exists= await prisma.projectMember.findFirst({
                where: {projectId : id, userId}
            })
            if(exists){
                throw{status: 409, message: 'You are already part of this project'}
            }

            const member= await prisma.projectMember.create({
                data:{
                    userId,
                    projectId: id,
                    role:'TST'
                }
            })

            res.json({message: 'Joined as TST', member})
        }catch(err){
            next(err);
        }
    })

//UPDATE -> MP din proiect poate modifica informatiile

    .patch('/:id', requireAuth, async(req: any, res,next)=>{
        try{
            const {id} = req.params;
            const {name, description, repoUrl} =req.body;
            const userId = req.user.id;

            const project= await prisma.project.findUnique({
                where:{id}
            })
            if(!project){
                throw{status: 404, message:'Project not found'}
            }

            const member= await prisma.projectMember.findFirst({
                where:{projectId: id, userId, role:'MP'}
            })
            if(!member){
                throw{status: 403, message: 'Only MPs from this project can update it'}
            }

            const updateData : any ={};
            if(name !== undefined){ 
                updateData.name=name;
            }
            if(description !== undefined){
                updateData.description=description;
            }
            if(repoUrl!==undefined){
                updateData.repoUrl=repoUrl;
            }

            const updated = await prisma.project.update({
                where: {id},
                data: updateData
            })
            
            res.json({message: 'Project updated', project: updated})
        }catch(err){
            next(err);
        }
    })

// DELETE -> doar creatorul (MP) proiectului

    .delete('/:id', requireAuth, async(req: any, res, next)=>{
        try{
            const {id} = req.params;
            const userId= req.user.id;

            const project= await prisma.project.findUnique({
                where: {id}
            })
            if(!project){
                throw{status: 404, message: 'Project not found'};
            }

            if(project.createdById !== userId){
                throw{status: 403, message: 'Only the project creator can delete it'};
            }

            await prisma.project.delete({where: {id}});
            res.json({message: 'Project deleted successfully'});
        } catch(err){
            next(err);
        }
    })

export default router;