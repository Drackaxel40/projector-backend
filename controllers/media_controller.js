import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, '../uploads'); // The path to the uploads folder

export default class MediaController {
    // Function for upload an image
    async uploadImage(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = `http://${process.env.ENVIRONMENT}:${process.env.SERVER_PORT}/uploads/${req.file.filename}`;
        res.json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
    }

    // Function for delete a image
    async deleteImage(req, res) {
        const imageName = req.params.imageName;
        const imagePath = path.join(uploadsPath, imageName);

        // Check if the file exists
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Return an error if the file does not exist
                return res.status(404).json({ error: 'Image not found' });
            }

            // Delete the file
            fs.unlink(imagePath, (err) => {
                if (err) {
                    // Error while deleting the file
                    return res.status(500).json({ error: 'Failed to delete image' });
                }

                // Return a success message
                res.json({ message: 'Image deleted successfully' });
            });
        });
    }
}
