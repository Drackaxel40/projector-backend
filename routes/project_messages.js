import { Router } from 'express';
import ProjectMessagesController from "../controllers/project_messages_controller.js";
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get("/:project_uuid", verifyToken, (req, res) => {
    new ProjectMessagesController().listAll(req, res);
});

router.post("/create", verifyToken, (req, res) => {
    new ProjectMessagesController().create(req, res);
});

router.put("/update/:id", verifyToken, (req, res) => {
    new ProjectMessagesController().update(req, res);
});

router.delete("/delete/:id", verifyToken, (req, res) => {
    new ProjectMessagesController().delete(req, res);
});

export default router;