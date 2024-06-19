import { Router } from 'express';
import TasksController from '../controllers/tasks_controller.js';


const router = Router();

router.get('/:uuid', (req, res) => {
    new TasksController().listAll(req, res);
});

router.post('/create', (req, res) => {
    new TasksController().create(req, res);
});

router.put('/update/:id', (req, res) => {
    new TasksController().update(req, res);
});

router.delete('/delete/:id', (req, res) => {
    new TasksController().delete(req, res);
});

export default router;
