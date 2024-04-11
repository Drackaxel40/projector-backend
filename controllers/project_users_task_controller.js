import { dbQuery } from "../db.js";

export default class ProjectUsersTasks {
    // Get task users of a project
    async listAll(req, res) {
        const [results, fields] = await dbQuery(`SELECT project_users_tasks.id, task_id, username, users.CREATED, lastLogin, task_name, task_description, task_status FROM project_users_tasks 
        JOIN users ON task_user_uuid = users.uuid
        JOIN tasks on task_id = tasks.id`, [req.params.uuid]);
        res.json(results);
    }

    // Get all tasks of a user
    async getUserTasks(req, res) {
        const [results, fields] = await dbQuery(`SELECT project_users_tasks.id, task_id, task_name, task_description, task_status, uuid, username FROM project_users_tasks
        JOIN tasks ON project_users_tasks.task_id = tasks.id
        JOIN users ON project_users_tasks.task_user_uuid = users.uuid
        WHERE task_user_uuid = ?`, [req.params.uuid]);
        res.json(results);
    }

    // Add a user to a task
    async create(req, res) {
        const [results, fields] = await dbQuery(`INSERT INTO project_users_tasks (task_id, task_user_uuid) VALUES (?, ?)`, [req.body.task_id, req.body.task_user_uuid]);
        res.json(results);
    }

    // Delete a user from a task
    async delete(req, res) {
        const [results, fields] = await dbQuery(`DELETE FROM project_users_tasks WHERE id = ?`, [req.params.id]);
        res.json(results);
    }
}