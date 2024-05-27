import { Router } from 'express';
import TaskStatusController from '../controllers/task_status_controller.js';
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, (req, res) => {
    new TaskStatusController().listAll(req, res);
});

router.post('/create', verifyToken, (req, res) => {
    new TaskStatusController().create(req, res);
});

router.put('/update/:id', verifyToken, (req, res) => {
    new TaskStatusController().update(req, res);
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    new TaskStatusController().delete(req, res);
});

export default router;