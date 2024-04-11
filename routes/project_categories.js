import { Router } from 'express';
import CategoriesController from '../controllers/categories_controller.js';
// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, (req, res) => {
    new CategoriesController().listAll(req, res);
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    new CategoriesController().delete(req, res);
});

router.post('/create', verifyToken, (req, res) => {
    new CategoriesController().create(req, res);
});

router.put('/update/:id', verifyToken, (req, res) => {
    new CategoriesController().update(req, res);
});

export default router;