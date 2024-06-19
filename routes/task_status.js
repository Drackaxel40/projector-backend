import { Router } from 'express';
import TaskStatusController from '../controllers/task_status_controller.js';


const router = Router();

router.get('/', (req, res) => {
    new TaskStatusController().listAll(req, res);
});

router.post('/create', (req, res) => {
    new TaskStatusController().create(req, res);
});

router.put('/update/:id', (req, res) => {
    new TaskStatusController().update(req, res);
});

router.delete('/delete/:id', (req, res) => {
    new TaskStatusController().delete(req, res);
});

export default router;