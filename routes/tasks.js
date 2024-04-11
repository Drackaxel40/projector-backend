import { Router } from 'express';
import TasksController from '../controllers/tasks_controller.js';

const router = Router();

router.get('/:uuid', (req, res) => {
    new TasksController().listAll(req, res);
});

router.post('/create', (req, res) => {
    new TasksController().create(req, res);
});

router.put('/update/status/:id', (req, res) => {
    new TasksController().updateStatus(req, res);
});

router.put('/update/name/:id', (req, res) => {
    new TasksController().updateName(req, res);
});

router.put('/update/description/:id', (req, res) => {
    new TasksController().updateDescription(req, res);
});

router.delete('/delete/:id', (req, res) => {
    new TasksController().delete(req, res);
});

export default router;
