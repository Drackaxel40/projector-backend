import express from 'express';
import MediaController from '../controllers/media_controller.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const mediaController = new MediaController();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const uploadsPath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2000000 }
});

// Post image
router.post('/', upload.single('image'), mediaController.uploadImage);

// Delete image
router.delete('/:imageName', (req, res) => mediaController.deleteImage(req, res));

export default router;
