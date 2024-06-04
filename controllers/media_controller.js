export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `http://${process.env.ENVIRONMENT}:${process.env.SERVER_PORT}/uploads/${req.file.filename}`;
    res.json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
};