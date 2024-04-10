import { dbQuery } from "../db.js";

export default class ProjectsController {
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM project');
        res.send(results);
    }

    async getOne(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM project WHERE user_uuid = ?', [req.params.uuid]);
        res.send(results);
    }

    async create(req, res) {
        const newProject = {
            project_name: req.body.project_name,
            project_description: req.body.project_description,
            user_uuid: req.body.user_uuid,
            project_category_id: req.body.project_category_id
        };

        const [results, fields] = await dbQuery('INSERT INTO project (uuid, project_name, project_description, user_uuid, project_category_id) VALUES (UUID(), ?, ?, ?, ?)', [newProject.project_name, newProject.project_description, newProject.user_uuid, newProject.project_category_id]);
        res.send({message: 'Created', results: results});
    }

    async deleteOne(req, res) {
        const [results, fields] = await dbQuery('DELETE FROM project WHERE uuid = ?', [req.params.uuid]);
        res.send({message: 'Deleted', results: results});
    }

    async updateOne(req, res) {
        const [results, fields] = await dbQuery('UPDATE project SET project_name = ?, project_description = ?, project_category_id = ? WHERE uuid = ?', [req.body.project_name, req.body.project_description, req.body.project_category_id, req.params.uuid]);
        res.send({message: 'Updated', results: results});
    }
};