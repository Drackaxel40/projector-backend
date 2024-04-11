import { Router } from 'express';
import ProjectUsersTasks from '../controllers/project_users_task_controller.js';
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, (req, res) => {
    new ProjectUsersTasks().listAll(req, res);
});

router.get('/:uuid', verifyToken, (req, res) => {
    new ProjectUsersTasks().getUserTasks(req, res);
});

router.post('/create', verifyToken, (req, res) => {
    new ProjectUsersTasks().create(req, res);
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    new ProjectUsersTasks().delete(req, res);
});

export default router;