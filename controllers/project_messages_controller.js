import { dbQuery } from "../db.js";

export default class ProjectMessagesController {
    // List all the project messages
    async listAll(req, res) {
        const [results, fields] = await dbQuery(`SELECT project_message.id, user_uuid, message_created, message_content, username, lastLogin FROM project_message JOIN users ON project_message.user_uuid = users.uuid WHERE project_uuid = ?`, [req.params.project_uuid]);
        res.send(results);
    }

    // Create a new project message
    async create(req, res) {
        const [results, fields] = await dbQuery('INSERT INTO project_message (project_uuid, user_uuid, message_content) VALUES (?, ?, ?)', [req.body.project_uuid, req.body.user_uuid, req.body.message_content]);
        res.send(results);
    }

    // Update a project message
    async update(req, res) {
        const [results, fields] = await dbQuery('UPDATE project_message SET message_content = ? WHERE id = ?', [req.body.message_content, req.params.id]);
        res.send(results);
    }

    // Delete a project message
    async delete(req, res) {
        const [results, fields] = await dbQuery('DELETE FROM project_message WHERE id = ?', [req.params.id]);
        res.send(results);
    }
}