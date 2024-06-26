import { Router } from 'express';
import UsersController from '../controllers/users_controller.js';
import verifyJWTToken from '../middleware/verifyJWTToken.js';
import verifyCSRFToken from '../middleware/verifyCSRFToken.js';


const router = Router();


router.post('/login', (req, res) => {
    new UsersController().login(req, res);
});

router.post('/create', (req, res) => {
    new UsersController().create(req, res);
});

router.get('/', verifyJWTToken, verifyCSRFToken, (req, res) => {
    new UsersController().listAll(req, res);
});


router.get('/:uuid', verifyJWTToken, verifyCSRFToken, (req, res) => {
    new UsersController().getOne(req, res);
});

router.get('/username/:username', verifyJWTToken, verifyCSRFToken, (req, res) => {
    new UsersController().getOneByUsername(req, res);
});


router.delete('/delete/:uuid', verifyJWTToken, verifyCSRFToken, (req, res) => {
    new UsersController().delete(req, res);
});

router.put('/update/:uuid', verifyJWTToken, verifyCSRFToken, (req, res) => {
    new UsersController().update(req, res);
});

router.put('/update/pwd/:uuid', verifyJWTToken, verifyCSRFToken, (req, res) => {
    new UsersController().updatePwd(req, res);
});

export default router;