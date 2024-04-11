import { dbQuery } from "../db.js";

export default class TasksController {
    // Get all the tasks by project
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM tasks WHERE project_uuid = ?', [req.params.uuid]);
        res.json(results);
    }

    // Create a task
    async create(req, res) {
        const [results, fields] = await dbQuery('INSERT INTO tasks (task_name, task_description, task_status, project_uuid) VALUES (?, ?, ?, ?)', [req.body.task_name, req.body.task_description, req.body.task_status, req.body.project_uuid]);
        res.json(results);
    }

    // Update a task status
    async updateStatus(req, res) {
        const [results, fields] = await dbQuery('UPDATE tasks SET task_status = ? WHERE id = ?', [req.body.task_status, req.params.id]);
        res.json(results);
    }

    // Update a task name
    async updateName(req, res) {
        const [results, fields] = await dbQuery('UPDATE tasks SET task_name = ? WHERE id = ?', [req.body.task_name, req.params.id]);
        res.json(results);
    }

    // Update a task description
    async updateDescription(req, res) {
        const [results, fields] = await dbQuery('UPDATE tasks SET task_description = ? WHERE id = ?', [req.body.task_description, req.params.id]);
        res.json(results);
    }

    // Delete a task
    async delete(req, res) {
        const [results, fields] = await dbQuery('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json(results);
    }
}
