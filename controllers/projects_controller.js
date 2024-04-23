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

    // Get projects by the user uuid
    async getUserProjects(req, res) {
        try {
            const [results, fields] = await dbQuery(`SELECT project.uuid, project_name, project_description, users.CREATED, users.UPDATED, project_deadline, project_category_id, project_status_id, username, category_name, status_name, project_created FROM project JOIN users ON project.user_uuid = users.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            JOIN project_status ON project.project_status_id = project_status.id WHERE user_uuid = ?`, [req.params.uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération du projet");
        }
    }

    // Get a project by his uuid
    async getOne(req, res) {
        try {
            const [results, fields] = await dbQuery(`SELECT project_name, project_deadline, status_name, username, project_description, project_created, project_updated, category_name, project_category_id, project_status_id, users.uuid AS user_uuid
            FROM project
            JOIN project_status ON project.project_status_id = project_status.id 
            JOIN users ON project.user_uuid = users.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            WHERE project.uuid = ?`, [req.params.uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération du projet");
        }
    }

    // Create a project
    async create(req, res) {
        const newProject = {
            project_name: req.body.project_name.toLowerCase(),
            project_description: req.body.project_description,
            user_uuid: req.body.user_uuid,
            project_category_id: req.body.project_category_id
        };

        if (req.body.project_deadline) {
            newProject.project_deadline = req.body.project_deadline;
        }

        try {
            const [insertResults, insertFields] = await dbQuery('INSERT INTO project (uuid, project_name, project_description, user_uuid, project_category_id, project_deadline) VALUES (UUID(), ?, ?, ?, ?, STR_TO_DATE(?, "%Y-%m-%d"))', [newProject.project_name, newProject.project_description, newProject.user_uuid, newProject.project_category_id, newProject.project_deadline]);
            res.status(201).json({ message: 'Created', results: insertResults });

        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du projet", error);
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
            const [results, fields] = await dbQuery('UPDATE project SET project_status_id = ?, project_deadline = ?, project_description = ?, project_category_id = ? WHERE uuid = ?', [req.body.project_status_id, req.body.project_deadline, req.body.project_description, req.body.project_category_id ,req.params.uuid]);
            res.send({ message: 'Updated', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du projet", error);
        }
    }
};