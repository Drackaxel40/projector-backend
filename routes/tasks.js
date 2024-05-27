import { Router } from 'express';
import TasksController from '../controllers/tasks_controller.js';
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get('/:uuid', verifyToken, (req, res) => {
    new TasksController().listAll(req, res);
});

router.post('/create', verifyToken, (req, res) => {
    new TasksController().create(req, res);
});

router.put('/update/:id', verifyToken, (req, res) => {
    new TasksController().update(req, res);
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    new TasksController().delete(req, res);
});

export default router;
