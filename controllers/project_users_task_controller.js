import { dbQuery } from "../db.js";

export default class ProjectUsersTasks {
    // Get task users of a project
    async listAll(req, res) {

        // Check if the project_uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Uuid manquant' });
        }

        try {
            const [results, fields] = await dbQuery(`SELECT project_users_tasks.id, task_id, username, users.CREATED, lastLogin, task_name, task_description, task_status FROM project_users_tasks 
            JOIN users ON task_user_uuid = users.uuid
            JOIN tasks on task_id = tasks.id`, [req.params.uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des utilisateurs de la tâche");
        }
    }

    // Get all tasks of a user
    async getUserTasks(req, res) {

        // Check if the uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Uuid manquant' });
        }

        try {
            const [results, fields] = await dbQuery(`SELECT project_users_tasks.id, task_id, task_name, task_description, task_status, uuid, username FROM project_users_tasks
            JOIN tasks ON project_users_tasks.task_id = tasks.id
            JOIN users ON project_users_tasks.task_user_uuid = users.uuid
            WHERE task_user_uuid = ?`, [req.params.uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des tâches de l'utilisateur");
        }
    }

    // Add a user to a task
    async create(req, res) {

        // Check if the task_id and the task_user_uuid are provided
        if (!req.body.task_id || !req.body.task_user_uuid) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        try {
            // Check if the task exists
            const [taskResults, taskFields] = await dbQuery('SELECT * FROM tasks WHERE id = ?', [req.body.task_id]);
            if (taskResults.length === 0) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            // Check if the user exists
            const [userResults, userFields] = await dbQuery('SELECT * FROM users WHERE uuid = ?', [req.body.task_user_uuid]);
            if (userResults.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Check if the user is already in the task
            const [userTaskResults, userTaskFields] = await dbQuery('SELECT * FROM project_users_tasks WHERE task_id = ? AND task_user_uuid = ?', [req.body.task_id, req.body.task_user_uuid]);
            if (userTaskResults.length > 0) {
                return res.status(409).json({ error: 'L\'utilisateur est déjà dans la tâche' });
            }

            // Check if the requesting user is the project owner
            const projectAuthor = await dbQuery(`SELECT project.user_uuid
            FROM project JOIN tasks ON project.uuid = tasks.project_uuid 
            WHERE tasks.id = ?`, [req.body.task_id]);
            if (projectAuthor[0].user_uuid !== req.user.uuid) {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à ajouter un utilisateur à cette tâche' });
            }

            // Add the user to the task
            const [results, fields] = await dbQuery(`INSERT INTO project_users_tasks (task_id, task_user_uuid) VALUES (?, ?)`, [req.body.task_id, req.body.task_user_uuid]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de l'ajout de l'utilisateur à la tâche");
        }
    }

    // Delete a user from a task
    async delete(req, res) {
        // Check if the id is provided
        if (!req.params.id) {
            return res.status(400).json({ error: 'Id manquant' });
        }

        try {
            // Check if the requesting user is the project owner
            const projectAuthor = await dbQuery(`
                SELECT project.user_uuid 
                FROM project 
                JOIN tasks ON project.uuid = tasks.project_uuid
                JOIN project_users_tasks ON tasks.id = project_users_tasks.task_id
                WHERE project_users_tasks.id = ?`, [req.params.id]);

            if (projectAuthor[0].user_uuid !== req.user.uuid) {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer un utilisateur de cette tâche' });
            }

            const [results, fields] = await dbQuery(`DELETE FROM project_users_tasks WHERE id = ?`, [req.params.id]);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression de l'utilisateur de la tâche");
        }
    }
}