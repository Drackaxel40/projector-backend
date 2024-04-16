import { dbQuery } from "../db.js";

export default class TasksController {
    // Get all the tasks by project
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT * FROM tasks WHERE project_uuid = ?', [req.params.uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des tâches");
        }
    }

    // Create a task
    async create(req, res) {
        try {
            const [results, fields] = await dbQuery('INSERT INTO tasks (task_name, task_description, task_status, project_uuid) VALUES (?, ?, ?, ?)', [req.body.task_name, req.body.task_description, req.body.task_status, req.body.project_uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création de la tâche");
        }
    }

    // Update a task status
    async updateStatus(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE tasks SET task_status = ? WHERE id = ?', [req.body.task_status, req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du statut de la tâche");
        }
    }


    // Update a task name
    async updateName(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE tasks SET task_name = ? WHERE id = ?', [req.body.task_name, req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du nom de la tâche");
        }
    }

    // Update a task description
    async updateDescription(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE tasks SET task_description = ? WHERE id = ?', [req.body.task_description, req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour de la description de la tâche");
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
