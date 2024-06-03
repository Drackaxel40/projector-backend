import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

// Configuring multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check if the file is an image
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Check if the file tall is less than 2MB
const limits = {
    fileSize: 2000000
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Endpoint to upload an image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ message: 'Image uploaded', imageUrl: imageUrl }); // Send the URL in the response
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
