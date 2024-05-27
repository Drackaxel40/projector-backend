import { dbQuery } from "../db.js";

export default class TasksController {
    // Get all the tasks by project
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery(`SELECT tasks.id as task_id, task_name, task_description, task_status_id, status_name
            FROM tasks 
            JOIN task_status ON tasks.task_status_id = task_status.id
            WHERE project_uuid = ?`, [req.params.uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des tâches");
        }
    }

    // Create a task
    async create(req, res) {
        try {
            const [results, fields] = await dbQuery('INSERT INTO tasks (task_name, task_description, project_uuid) VALUES (?, ?, ?)', [req.body.task_name, req.body.task_description, req.body.project_uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création de la tâche");
        }
    }

    // Update a task
    async update(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE tasks SET task_name = ?, task_status_id = ?, task_description = ? WHERE id = ?', [req.body.task_name, req.body.task_status_id, req.body.task_description, req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour de la tâche");
        }
    }

    // Delete a task
    async delete(req, res) {
        try {
            const [results, fields] = await dbQuery('DELETE FROM tasks WHERE id = ?', [req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression de la tâche");
        }
    }
}
