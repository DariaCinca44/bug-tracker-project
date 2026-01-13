// routerul principal care grupeaza toate API-urile:
// - /auth -> autentificare si inregistrare utilizatori
// - /projects -> management proiecte si membership
// - /bugs -> rute pentru gestionarea bug-urilor
// - /users -> rute pentru gestionarea utilizatorilor

import { Router } from "express";
import authRoutes from "./auth.js";
import projectRoutes from "./projects.js";
import bugRoutes from "./bugs.js";
import userRoutes from "./users.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/bugs", bugRoutes);
router.use("/users", userRoutes);

export default router;
