// acest fisier contine rute pentru gestionarea proiectelor:
// - crearea si stergerea proiectelor
// - aderarea si parasirea unui proiect
// - actualizarea informatiilor unui proiect
// - gestionarea membrilor unui proiect
// - afisarea bug-urilor asociate unui proiect

import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddlewares.js";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//GET PROJECTS -> returneaza proiectele in care utilizatorul este MP sau TST
router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

//GET PROJECTS -> returneaza toate proiectele postate de catre toti utilizatorii
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET PROJECT BY ID -> cu membri + user
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw { status: 404, message: "Project not found" };
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
});


//CREATE PROJECT -> orice user logat, devine automat MP in proiectul creat
router
  .post("/", requireAuth, async (req, res, next) => {
    try {
      const { name, description, repoUrl } = req.body;

      if (!name || !repoUrl) {
        throw { status: 400, message: "Name and repoURL are mandatory" };
      }

      const existing = await prisma.project.findFirst({
        where: { repoUrl },
      });
      if (existing) {
        throw {
          status: 409,
          message: "A project with this repository already exists",
        };
      }

      const user = req.user;
      const project = await prisma.project.create({
        data: {
          name,
          description,
          repoUrl,
          createdById: user.id,
        },
      });

      //adaugarea automata ca MP in proiectul creat
      await prisma.projectMember.create({
        data: {
          userId: user.id,
          projectId: project.id,
          role: "MP",
        },
      });

      res.status(201).json({ message: "Project created", project });
    } catch (err) {
      next(err);
    }
  })

  //JOIN -> userul intra in proiect ca TST

  .post("/:id/join", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const project = await prisma.project.findUnique({
        where: { id },
      });
      if (!project) {
        throw { status: 404, message: "Project not found" };
      }

      const exists = await prisma.projectMember.findFirst({
        where: { projectId: id, userId },
      });
      if (!exists) {
        const created = await prisma.projectMember.create({
          data: {
            projectId: id,
            userId,
            role: "TST",
          },
        });
        return res.json({ message: "Joined as TST", member: created });
      }
      if (exists.role === "TST") {
        throw {
          status: 409,
          message: "You are already a tester in this project",
        };
      }

      const updated = await prisma.projectMember.update({
        where: { id: exists.id },
        data: { role: "TST" },
      });

      res.json({ message: "Joined as TST", exists: updated });
    } catch (err) {
      next(err);
    }
  })

  //UPDATE -> MP din proiect poate modifica informatiile

  .patch("/:id", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, repoUrl } = req.body;
      const userId = req.user.id;

      const project = await prisma.project.findUnique({
        where: { id },
      });
      if (!project) {
        throw { status: 404, message: "Project not found" };
      }

      const member = await prisma.projectMember.findFirst({
        where: { projectId: id, userId, role: "MP" },
      });
      if (!member) {
        throw {
          status: 403,
          message: "Only MPs from this project can update it",
        };
      }

      const updateData = {};
      if (name !== undefined) {
        updateData.name = name;
      }
      if (description !== undefined) {
        updateData.description = description;
      }
      if (repoUrl !== undefined) {
        updateData.repoUrl = repoUrl;
      }

      const updated = await prisma.project.update({
        where: { id },
        data: updateData,
      });

      res.json({ message: "Project updated", project: updated });
    } catch (err) {
      next(err);
    }
  })

  // DELETE -> doar creatorul (MP) proiectului

  .delete("/:id", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const project = await prisma.project.findUnique({
        where: { id },
      });
      if (!project) {
        throw { status: 404, message: "Project not found" };
      }

      if (project.createdById !== userId) {
        throw {
          status: 403,
          message: "Only the project creator can delete it",
        };
      }

      await prisma.project.delete({ where: { id } });
      res.json({ message: "Project deleted successfully" });
    } catch (err) {
      next(err);
    }
  });

// LEAVE PROJECT -> userul iese din proiect (TST)
router.delete("/:id/leave", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const member = await prisma.projectMember.findFirst({
      where: { projectId: id, userId },
    });

    if (!member) {
      throw { status: 404, message: "Not a project member" };
    }

    if (member.role === "MP") {
      throw { status: 403, message: "MP cannot leave the project" };
    }

    await prisma.projectMember.delete({
      where: { id: member.id },
    });

    res.json({ message: "Left project successfully" });
  } catch (err) {
    next(err);
  }
});

// GET bugs dintr-un proiect
router.get("/:id/bugs", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // verificam ca userul e membru
    const member = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId
      }
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied" });
    }

    const bugs = await prisma.bug.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" }
    });

    res.json(bugs);
  } catch (err) {
    next(err);
  }
});

// PROMOTE MEMBER -> doar MP poate promova un TST la MP
router.patch("/:projectId/members/:userId/promote", requireAuth, async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;
    const requesterId = req.user.id;

    const requester = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: requesterId,
        role: "MP"
      }
    });

    if (!requester) {
      throw {
        status: 403,
        message: "Only MPs can promote users"
      };
    }

    const member = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId
      }
    });

    if (!member) {
      throw {
        status: 404,
        message: "User not found in project"
      };
    }

    if (member.role === "MP") {
      throw {
        status: 400,
        message: "User is already MP"
      };
    }

    const updated = await prisma.projectMember.update({
      where: { id: member.id },
      data: { role: "MP" }
    });

    res.json({
      message: "User promoted to MP",
      member: updated
    });
  } catch (err) {
    next(err);
  }
});


export default router;
