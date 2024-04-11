import { Router } from 'express';
import ProjectStatusController from '../controllers/project_status_controller.js';

const router = Router();

router.get('/', (req, res) => {
    new ProjectStatusController().listAll(req, res);
});

router.post('/create', (req, res) => {
    new ProjectStatusController().create(req, res);
});

router.put('/update/:id', (req, res) => {
    new ProjectStatusController().update(req, res);
});

router.delete('/delete/:id', (req, res) => {
    new ProjectStatusController().delete(req, res);
});

export default router;