import { Router } from 'express';
import ProjectMembersController from "../controllers/project_members_controller.js";
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get("/:uuid", verifyToken, (req, res) => {
    new ProjectMembersController().listAll(req, res);
});

router.get("/user/:uuid", verifyToken, (req, res) => {
    new ProjectMembersController().getUserProjects(req, res);
});

router.post("/create", verifyToken, (req, res) => {
    new ProjectMembersController().create(req, res);
});

router.put("/update/:id", verifyToken, (req, res) => {
    new ProjectMembersController().update(req, res);
});

router.delete("/delete/:id", verifyToken, (req, res) => {
    new ProjectMembersController().delete(req, res);
});


export default router;