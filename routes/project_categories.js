import { Router } from 'express';
import CategoriesController from '../controllers/categories_controller.js';

const router = Router();

router.get('/', (req, res) => {
    new CategoriesController().listAll(req, res);
});

router.delete('/delete/:id', (req, res) => {
    new CategoriesController().delete(req, res);
});

router.post('/create', (req, res) => {
    new CategoriesController().create(req, res);
});

router.put('/update/:id', (req, res) => {
    new CategoriesController().update(req, res);
});

export default router;