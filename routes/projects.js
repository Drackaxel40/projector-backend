import { Router } from 'express';
import ProjectsController from '../controllers/projects_controller.js';
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, (req, res) => {
        new ProjectsController().listAll(req, res);
});

router.get('/:uuid', verifyToken, (req, res) => {
    new ProjectsController().getOne(req, res);
});

router.delete('/delete/:uuid', verifyToken, (req, res) => {
    new ProjectsController().deleteOne(req, res);
});

router.post('/create', verifyToken, (req, res) => {
    new ProjectsController().create(req, res);
});

router.put('/update/:uuid', verifyToken, (req, res) => {
    new ProjectsController().updateOne(req, res);
});

export default router;