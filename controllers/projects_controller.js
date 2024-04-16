import { dbQuery } from "../db.js";

export default class ProjectsController {
    // List all projects
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT * FROM project');
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des projets");
        }
    }

    // Get one project by his uuid
    async getOne(req, res) {
        try {
            const [results, fields] = await dbQuery(`SELECT project.uuid, project_name, project_description, users.CREATED, users.UPDATED, project_deadline, project_category_id, project_status_id, username, category_name, status_name FROM project JOIN users ON project.user_uuid = users.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            JOIN project_status ON project.project_status_id = project_status.id WHERE user_uuid = ?`, [req.params.uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération du projet");
        }
    }

    // Create a new project
    async create(req, res) {
        const newProject = {
            project_name: req.body.project_name,
            project_description: req.body.project_description,
            user_uuid: req.body.user_uuid,
            project_category_id: req.body.project_category_id
        };
        try {
            const [results, fields] = await dbQuery('INSERT INTO project (uuid, project_name, project_description, user_uuid, project_category_id) VALUES (UUID(), ?, ?, ?, ?)', [newProject.project_name, newProject.project_description, newProject.user_uuid, newProject.project_category_id]);
            res.send({ message: 'Created', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du projet");
        }
    }

    // Delete a project by his uuid
    async deleteOne(req, res) {
        try {
            const [results, fields] = await dbQuery('DELETE FROM project WHERE uuid = ?', [req.params.uuid]);
            res.send({ message: 'Deleted', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du projet");
        }
    }

    // Update a project by his uuid
    async updateOne(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE project SET project_name = ?, project_description = ?, project_category_id = ? WHERE uuid = ?', [req.body.project_name, req.body.project_description, req.body.project_category_id, req.params.uuid]);
            res.send({ message: 'Updated', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du projet");
        }
    }
};