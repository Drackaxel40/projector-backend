import { Router } from 'express';
import UsersController from '../controllers/users_controller.js';

const router = Router();

router.get('/', (req, res) => {
    // call the controller here
    new UsersController().listAll(req, res);
});

export default router;