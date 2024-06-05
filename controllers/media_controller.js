import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, '../uploads'); // Définir le chemin du dossier uploads ici

export default class MediaController {
    // Fonction pour traiter le téléchargement d'une image
    async uploadImage(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = `http://${process.env.ENVIRONMENT}:${process.env.SERVER_PORT}/uploads/${req.file.filename}`;
        res.json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
    }

    // Fonction pour supprimer une image
    async deleteImage(req, res) {
        const imageName = req.params.imageName;
        const imagePath = path.join(uploadsPath, imageName);

        // Vérifie si le fichier existe
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Le fichier n'existe pas
                return res.status(404).json({ error: 'Image not found' });
            }

            // Supprimer le fichier
            fs.unlink(imagePath, (err) => {
                if (err) {
                    // Erreur lors de la suppression du fichier
                    return res.status(500).json({ error: 'Failed to delete image' });
                }

                // Succès
                res.json({ message: 'Image deleted successfully' });
            });
        });
    }
}
