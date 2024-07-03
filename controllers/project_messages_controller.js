import { dbQuery } from "../db.js";
import { checkUUIDFormat } from "../helpers/functions.js";

export default class ProjectMessagesController {
    // List all the project messages
    async listAll(req, res) {
        try {

            // Check if the project_uuid is provided
            if (!req.params.project_uuid) {
                return res.status(400).json({ error: 'Uuid manquant' });
            }

            // Check if the project_uuid format is correct
            if (!checkUUIDFormat(req.params.project_uuid)) {
                return res.status(400).json({ error: 'Uuid incorrect' });
            }

            const [results, fields] = await dbQuery(`SELECT project_message.id, user_uuid, message_created, message_content, username, lastLogin, modified
                FROM project_message 
                JOIN users ON project_message.user_uuid = users.uuid 
                WHERE project_uuid = ? 
                ORDER by message_created`, [req.params.project_uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des messages de projet");
        }
    }

    // Create a new project message
    async create(req, res) {
        // Check if the project_uuid, user_uuid and message_content are provided
        if (!req.body.project_uuid || !req.body.user_uuid || !req.body.message_content) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Check if the project_uuid format is correct
        if (!checkUUIDFormat(req.body.project_uuid)) {
            return res.status(400).json({ error: 'Uuid incorrect' });
        }

        // Check if the user_uuid format is correct
        if (!checkUUIDFormat(req.body.user_uuid)) {
            return res.status(400).json({ error: 'Uuid incorrect' });
        }

        try {
            // Check if the project exists
            const [projectResults, projectFields] = await dbQuery('SELECT * FROM project WHERE uuid = ?', [req.body.project_uuid]);
            if (projectResults.length === 0) {
                return res.status(404).json({ error: 'Projet non trouvé' });
            }

            // // Check if the requesting user is a member of the project
            // const [projectUsersResults, projectUsersFields] = await dbQuery('SELECT * FROM project_members WHERE project_uuid = ? AND user_uuid = ?', [req.body.project_uuid, req.requestingUserUUID]);
            // if (projectUsersResults.length === 0) {
            //     return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            // }

            // Create the project message
            const [results, fields] = await dbQuery('INSERT INTO project_message (project_uuid, user_uuid, message_content) VALUES (?, ?, ?)', [req.body.project_uuid, req.body.user_uuid, req.body.message_content]);
            res.send({ message: 'Message créé' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du message de projet");
        }
    }

    // Update a project message
    async update(req, res) {
        // Check if the message_content and the id provided
        if (!req.body.message_content || !req.params.id) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        try {
            // Check if the message exists
            const messageResults = await dbQuery('SELECT * FROM project_message WHERE id = ?', [req.params.id]);
            if (messageResults.length === 0) {
                return res.status(404).json({ error: 'Message non trouvé' });
            }

            // Check if the requesting user is the author of the message
            if (messageResults[0][0].user_uuid !== req.requestingUserUUID) {
                return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            }

            const [results, fields] = await dbQuery('UPDATE project_message SET message_content = ? , modified = 1 WHERE id = ?', [req.body.message_content, req.params.id]);
            res.send({message: 'Message mis à jour'});
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du message de projet");
        }
    }

    // Delete a project message
    async delete(req, res) {
        // Check if the id is provided
        if (!req.params.id) {
            return res.status(400).json({ error: 'Id manquant' });
        }

        // Check if the message exists
        const messageResults = await dbQuery('SELECT * FROM project_message WHERE id = ?', [req.params.id]);
        if (messageResults.length === 0) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        // Check if the requesting user is the author of the message
        if (messageResults[0][0].user_uuid !== req.requestingUserUUID) {
            return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
        }

        try {

            const [results, fields] = await dbQuery('DELETE FROM project_message WHERE id = ?', [req.params.id]);
            return results
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du message de projet");
        }
    }
}