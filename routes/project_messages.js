import { Router } from 'express';
import ProjectMessagesController from "../controllers/project_messages_controller.js";

const router = Router();

router.get("/:project_uuid", (req, res) => {
    new ProjectMessagesController().listAll(req, res);
});

router.post("/create", (req, res) => {
    new ProjectMessagesController().create(req, res);
});

router.put("/update/:id", (req, res) => {
    new ProjectMessagesController().update(req, res);
});

router.delete("/delete/:id", (req, res) => {
    new ProjectMessagesController().delete(req, res);
});

export default router;