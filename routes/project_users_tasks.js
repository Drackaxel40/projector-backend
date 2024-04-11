import { Router } from 'express';
import ProjectUsersTasks from '../controllers/project_users_task_controller.js';

const router = Router();

router.get('/', (req, res) => {
    new ProjectUsersTasks().listAll(req, res);
});

router.get('/:uuid', (req, res) => {
    new ProjectUsersTasks().getUserTasks(req, res);
});

router.post('/create', (req, res) => {
    new ProjectUsersTasks().create(req, res);
});

router.delete('/delete/:id', (req, res) => {
    new ProjectUsersTasks().delete(req, res);
});

export default router;