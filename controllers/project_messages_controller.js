import { dbQuery } from "../db.js";

export default class ProjectMessagesController {
    // List all the project messages
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery(`SELECT project_message.id, user_uuid, message_created, message_content, username, lastLogin, modified FROM project_message JOIN users ON project_message.user_uuid = users.uuid WHERE project_uuid = ? ORDER by message_created`, [req.params.project_uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des messages de projet");
        }
    }

    // Create a new project message
    async create(req, res) {
        try {
            const [results, fields] = await dbQuery('INSERT INTO project_message (project_uuid, user_uuid, message_content) VALUES (?, ?, ?)', [req.body.project_uuid, req.body.user_uuid, req.body.message_content]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du message de projet");
        }
    }

    // Update a project message
    async update(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE project_message SET message_content = ? , modified = 1 WHERE id = ?', [req.body.message_content, req.params.id]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du message de projet");
        }
    }

    // Delete a project message
    async delete(req, res) {
        try {
            const [results, fields] = await dbQuery('DELETE FROM project_message WHERE id = ?', [req.params.id]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du message de projet");
        }
    }
}