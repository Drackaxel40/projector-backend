import { Router } from 'express';
import ProjectMembersController from "../controllers/project_members_controller.js";


const router = Router();

router.get("/:uuid", (req, res) => {
    new ProjectMembersController().listAll(req, res);
});

router.get("/user/:uuid", (req, res) => {
    new ProjectMembersController().getUserProjects(req, res);
});

router.post("/create", (req, res) => {
    new ProjectMembersController().create(req, res);
});

router.put("/update/:id", (req, res) => {
    new ProjectMembersController().update(req, res);
});

router.delete("/delete/:id", (req, res) => {
    new ProjectMembersController().delete(req, res);
});


export default router;