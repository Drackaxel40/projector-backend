import { Router } from 'express';
import ProjectStatusController from '../controllers/project_status_controller.js';
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, (req, res) => {
    new ProjectStatusController().listAll(req, res);
});

router.post('/create', verifyToken, (req, res) => {
    new ProjectStatusController().create(req, res);
});

router.put('/update/:id', verifyToken, (req, res) => {
    new ProjectStatusController().update(req, res);
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    new ProjectStatusController().delete(req, res);
});

export default router;