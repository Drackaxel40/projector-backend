import { Router } from 'express';
import UsersController from '../controllers/users_controller.js';

const router = Router();

router.get('/', (req, res) => {
    new UsersController().listAll(req, res);
});

router.get('/:uuid', (req, res) => {
    new UsersController().getOne(req, res);
});

router.post('/create', (req, res) => {
    new UsersController().create(req, res);
});

router.delete('/delete/:uuid', (req, res) => {
    new UsersController().delete(req, res);
});

router.put('/update/username/:uuid', (req, res) => {
    new UsersController().updateUsername(req, res);
});

router.put('/update/email/:uuid', (req, res) => {
    new UsersController().updateEmail(req, res);
});

router.put('/update/pwd/:uuid', (req, res) => {
    new UsersController().updatePwd(req, res);
});

export default router;