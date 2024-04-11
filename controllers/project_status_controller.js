import { dbQuery } from "../db.js";

export default class ProjectStatusController {

    // Get all the project statuses
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM project_status');
        res.json(results);
    }

    // Create a project status
    async create(req, res) {
        const [results, fields] = await dbQuery('INSERT INTO project_status (status_name) VALUES (?)', [req.body.status_name]);
        res.json(results);
    }

    // Update a project status
    async update(req, res) {
        const [results, fields] = await dbQuery('UPDATE project_status SET status_name = ? WHERE id = ?', [req.body.status_name, req.params.id]);
        res.json(results);
    }

    // Delete a project status
    async delete(req, res) {
        const [results, fields] = await dbQuery('DELETE FROM project_status WHERE id = ?', [req.params.id]);
        res.json(results);
    }
}