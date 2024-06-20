import { dbQuery } from "../db.js";

export default class ProjectStatusController {

    // Get all the project statuses
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT * FROM project_status');
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des statuts de projet");
        }
    }

    // Create a project status
    async create(req, res) {

        // Check if the status_name is provided
        if (!req.body.status_name) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Check if the user is an administrator
        const result = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
        const statut = result[0][0].statut;
        if (statut !== 'administrateur') {
            return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
        }

        try {
            const [results, fields] = await dbQuery('INSERT INTO project_status (status_name) VALUES (?)', [req.body.status_name]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du statut de projet");
        }
    }

    // Update a project status
    async update(req, res) {

        // Check if the status_name and the id are provided
        if (!req.body.status_name || !req.params.id) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        try {
            // Check if the user is an administrator
            const result = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            const statut = result[0][0].statut;
            if (statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            }

            // Check if the project status exists
            const [projectStatusResults, projectStatusFields] = await dbQuery('SELECT * FROM project_status WHERE id = ?', [req.params.id]);
            if (projectStatusResults.length === 0) {
                return res.status(404).json({ error: 'Statut de projet non trouvé' });
            }

            const [results, fields] = await dbQuery('UPDATE project_status SET status_name = ? WHERE id = ?', [req.body.status_name, req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du statut de projet");
        }
    }

    // Delete a project status
    async delete(req, res) {

        // Check if the id is provided
        if (!req.params.id) {
            return res.status(400).json({ error: 'Id manquant' });
        }

        try {
            // Check if the user is an administrator
            const result = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            const statut = result[0][0].statut;
            if (statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            }

            // Check if the project status exists
            const [projectStatusResults, projectStatusFields] = await dbQuery('SELECT * FROM project_status WHERE id = ?', [req.params.id]);
            if (projectStatusResults.length === 0) {
                return res.status(404).json({ error: 'Statut de projet non trouvé' });
            }

            // Delete the project status
            const [results, fields] = await dbQuery('DELETE FROM project_status WHERE id = ?', [req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du statut de projet");
        }
    }
}