import { dbQuery } from '../db.js';

export default class TaskStatusController {
    // Get all the tasks status
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT id, status_name FROM task_status');
            res.json(results);
        } catch (error) {
            console.log('Une erreur est survenue lors de la récupération des statuts de tâches');
        }
    }

    // Create a task status
    async create(req, res) {

        // Check if the status_name is provided
        if (!req.body.status_name) {
            res.status(400).json({ error: 'Données manquantes' });
            return;
        }

        try {
            const [results, fields] = await dbQuery('INSERT INTO task_status (status_name) VALUES (?)', [req.body.status_name]);
            res.json(results);
        } catch (error) {
            console.log('Une erreur est survenue lors de la création du statut de tâche');
        }
    }

    // Update a task status
    async update(req, res) {
        // Check if the status_name and the id are provided
        if (!req.body.status_name || !req.params.id) {
            res.status(400).json({ error: 'Données manquantes'});
            return;
        }

        try {
            const [results, fields] = await dbQuery('UPDATE task_status SET status_name = ? WHERE id = ?', [req.body.status_name, req.params.id]);
            res.json(results);
        } catch (error) {
            console.log('Une erreur est survenue lors de la mise à jour du statut de tâche');
        }
    }

    // Delete a task status
    async delete(req, res) {
        
        // Check if the id is provided
        if (!req.params.id) {
            res.status(400).json({ error: 'Id manquant' });
            return;
        }

        try {
            const [results, fields] = await dbQuery('DELETE FROM task_status WHERE id = ?', [req.params.id]);
            res.json(results);
        } catch (error) {
            console.log('Une erreur est survenue lors de la suppression du statut de tâche');
        }
    }
}