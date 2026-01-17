// acest fisier contine rute pentru gestionarea comentariilor unui bug:
// - afisarea comentariilor unui bug
// - adaugarea unui comentariu nou
// - editarea unui comentariu (doar autorul)
// - stergerea unui comentariu (doar autorul)

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middlewares/authMiddlewares.js";

const prisma = new PrismaClient();
const router = Router();

// GET -> afiseaza toate comentariile

router  
    .get("/bugs/:bugId/comments", requireAuth, async(req, res, next) => {
        try{
            const {bugId} = req.params;
            const userId = req.user.id;

            const bug= await prisma.bug.findUnique({
                where: {id: bugId}
            })

            if(!bug){
                throw{status: 404, message: "Bug not found"};
            }

            const member= await prisma.projectMember.findFirst({
                where: {
                    userId,
                    projectId: bug.projectId
                }
            })
            
            if(!member){
                throw{status: 403, message: "Access denied"}
            }

            const comments = await prisma.bugComment.findMany({
                where: {bugId},
                include : {
                    author: {
                        select: {id: true, name:true }
                    }
                },
                orderBy: {createdAt: "asc"}
            })

            res.json(comments);
        } catch(err){
            next(err);
        }
    })

// POST -> adaugare comentarii la bug

    .post("/bugs/:bugId/comments", requireAuth, async( req, res, next)=> {
        try{
            const{bugId} = req.params;
            const {content} = req.body;
            const userId = req.user.id;

            if(!content) {
                throw {status: 400, message: "Content is required"};
            }

            const bug = await prisma.bug.findUnique({
                where: {id: bugId}
            })
            if(!bug){
                throw{status: 404, message: "Bug not found"};
            }

            const member = await prisma.projectMember.findFirst({
                where: {
                    userId,
                    projectId: bug.projectId
                }
            })
            if(!member){
                throw{status: 403, message: "You are not a member of this project"};
            }

            const comment = await prisma.bugComment.create({
                data: {
                    content,
                    bugId,
                    authorId: userId
                }
            })
            
            res.status(201).json(comment);
        }catch(err){
            next(err);
        }
    })

// POST -> editare comentarii doar de catre utilizatorul care l-a postat

    .patch("/comments/:commentId", requireAuth, async(req, res, next)=> {
        try{
            const {commentId} = req.params;
            const {content} = req.body;
            const userId = req.user.id;

            if(!content) {
                throw{ status: 400, message: "Content is required"};
            }

            const comment = await prisma.bugComment.findUnique({
                where: {id: commentId}
            })
            if(!comment){
                throw {status: 404, message: "Comment not found"};
            }
            
            if(comment.authorId !== userId){
                throw {status: 403, message: "You can edit only your comments"}
            }
            const updated = await prisma.bugComment.update({
                where: {id: commentId},
                data: {content}
            })

            res.json(updated);
        } catch(err){
            next(err);
        }
    })

//DELETE -> stergerea unui comentariu doar de catre utilizatorul care l-a postat
    .delete("/comments/:commentId", requireAuth, async(req, res, next)=>{
        try{
            const {commentId} = req.params;
            const userId = req.user.id;

            const comment= await prisma.bugComment.findUnique({
                where: {id: commentId}
            })
            if(!comment){
                throw{status: 404, message: "Comment not found"}
            }

            if(comment.authorId !== userId){
                throw{status: 403, message: "You can delete only your comments"}
            }

            await prisma.bugComment.delete({
                where: {id: commentId}
            })

            res.status(204).send();
        } catch(err){
            next(err);
        }
    })

export default router;