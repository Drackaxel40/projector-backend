import { Router } from 'express';
import UsersController from '../controllers/users_controller.js';

// Authentification Middleware
import verifyToken from '../middleware/auth.js';

const router = Router();


router.post('/login', (req, res) => {
    new UsersController().login(req, res);
});

router.post('/create', (req, res) => {
    new UsersController().create(req, res);
});

router.get('/', verifyToken, (req, res) => {
    new UsersController().listAll(req, res);
});


router.get('/:uuid', verifyToken, (req, res) => {
    new UsersController().getOne(req, res);
});


router.delete('/delete/:uuid', verifyToken, (req, res) => {
    new UsersController().delete(req, res);
});

router.put('/update/username/:uuid', verifyToken, (req, res) => {
    new UsersController().updateUsername(req, res);
});

router.put('/update/email/:uuid', verifyToken, (req, res) => {
    new UsersController().updateEmail(req, res);
});

router.put('/update/pwd/:uuid', verifyToken, (req, res) => {
    new UsersController().updatePwd(req, res);
});

export default router;