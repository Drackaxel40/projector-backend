import { Router } from 'express';
import UsersController from '../controllers/users_controller.js';

const router = Router();

router.get('/', (req, res) => {
    // call the controller here
    new UsersController().listAll(req, res);
});

router.post('/create', (req, res) => {
    // call the controller here
    new UsersController().create(req, res);
});

router.delete('/delete/:uuid', (req, res) => {
    // call the controller here
    new UsersController().delete(req, res);
});

router.put('/update/:uuid', (req, res) => {
    // call the controller here
    new UsersController().update(req, res);
});

export default router;