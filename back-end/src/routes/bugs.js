// acest fisier contine rute pentru gestionarea bug-urilor:
// - crearea unui bug de catre TST
// - vizualizarea unui bug
// - asignarea unui bug ca MP
// - schimbarea statusului unui bug ca MP

import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddlewares.js";
import { PrismaClient} from "@prisma/client";
import { awardXP } from "../utils/xp.js";

const prisma= new PrismaClient();
const router= Router();

// REPORT BUG -> doar TST din proiect
router
    .post('/projects/:projectId/bugs', requireAuth, async (req, res, next) =>{
        try{
            const {projectId} = req.params;
            const userId = req.user.id;
            const {title, description, severity, priority, commitUrl} = req.body;

            if(!title || !description || !severity || !priority || !commitUrl){
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
                    commitUrl,
                    projectId,
                    reporterId: userId
                }
            })

            await awardXP(
                userId,
                10,
                'Bug reported',
                bug.id
            )
            res.status(201).json(bug);
        }catch(err){
            next(err);
        }       
    })

    .get('/bug/:bugId', requireAuth, async (req, res, next) => {
        try {
            const { bugId } = req.params;
            const userId = req.user.id;

            const bug = await prisma.bug.findUnique({
                where: { id: bugId },
            });

            if (!bug) {
                throw { status: 404, message: 'Bug not found' };
            }

            // verificam ca userul face parte din proiect
            const member = await prisma.projectMember.findFirst({
            where: {
                userId,
                projectId: bug.projectId,
                },
            });

            if (!member) {
                throw { status: 403, message: 'Access denied to this bug' };
            }

            res.json(bug);
        } catch (err) {
            next(err);
        }
    })


// ASSIGN BUG -> doar MP 

    .patch('/:bugId/assign', requireAuth, async (req, res, next)=>{
        try{
            const {bugId} = req.params;
            const userId= req.user.id;

            const bug = await prisma.bug.findUnique({where : {id: bugId}});
            if(!bug){
                throw {status: 404, message: 'Bug not found'};
            }

            if (bug.status !== "OPEN" || bug.assignedId) {
                throw {
                    status: 400,
                    message: "Bug is already assigned"
                };
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

            await prisma.notification.create({
                data: {
                    userId: userId,
                    type: "BUG_ASSIGNED",
                    message: `You have been assigned to bug "${bug.title}"`
                }
            })
            res.json(updated);
        }catch(err){
            next(err);
        }
    })

// UPDATE STATUS  -> doar MP

    .patch('/:bugId/status', requireAuth, async (req, res, next)=>{
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

            if (status === "IN_PROGRESS" && bug.status !== "OPEN") {
                throw {
                    status: 400,
                    message: "Bug can move to IN_PROGRESS only from OPEN"
                };
                }

                if (status === "RESOLVED" && bug.status !== "IN_PROGRESS") {
                throw {
                    status: 400,
                    message: "Bug must be IN_PROGRESS to be resolved"
                };
                }

            if(status=== "RESOLVED"){
                if(!bug.assignedId){
                    throw {
                        status: 400,
                        message: 'Bug must be assigned before it can be resolved'
                    }
                }

                if(bug.assignedId !== userId){
                    throw {
                        status: 403,
                        message: 'Only the assigned MP can resolve this bug'
                    }
                }

                if(!commitUrl){
                    throw{
                        status: 400,
                        message: 'Commit URL is required to resolve the bug'
                    }
                }
            }
            const updated = await prisma.bug.update({
                where: {id: bugId},
                data: {
                    status,
                    commitUrl
                }
            })

            if(bug.status !== status){
                await prisma.bugStatusHistory.create({
                    data: {
                        bugId: bug.id,
                        changedById: userId,
                        fromStatus: bug.status,
                        toStatus: status,
                        commitUrl
                    }
                })
            }

            if(bug.status !== "RESOLVED" && status === "RESOLVED" && bug.assignedId){
                await awardXP(
                    bug.assignedId,
                    30,
                    "Bug resolved",
                    bug.id
                )

                await prisma.notification.create({
                    data: {
                        userId: bug.assignedId,
                        type:"BUG_RESOLVED",
                        message: `Bug "${bug.title}" has been resolved`
                    }
                })
            }
            res.json(updated);
        }catch(err){
            next(err);
        }
    })

export default router;