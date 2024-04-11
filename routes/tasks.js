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

router.put('/update/status/:id', verifyToken, (req, res) => {
    new TasksController().updateStatus(req, res);
});

router.put('/update/name/:id', verifyToken, (req, res) => {
    new TasksController().updateName(req, res);
});

router.put('/update/description/:id', verifyToken, (req, res) => {
    new TasksController().updateDescription(req, res);
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    new TasksController().delete(req, res);
});

export default router;
