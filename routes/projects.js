import { Router } from 'express';
import ProjectsController from '../controllers/projects_controller.js';

const router = Router();

router.get('/', (req, res) => {
        new ProjectsController().listAll(req, res);
});

router.get('/:uuid', (req, res) => {
    new ProjectsController().getOne(req, res);
});

router.delete('/delete/:uuid', (req, res) => {
    new ProjectsController().deleteOne(req, res);
});

router.post('/create', (req, res) => {
    new ProjectsController().create(req, res);
});

router.put('/update/:uuid', (req, res) => {
    new ProjectsController().updateOne(req, res);
});

export default router;