import { dbQuery } from "../db.js";

export default class ProjectsController {
    // List all projects
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery(`
            SELECT project.uuid, project_name, project_description, project_deadline, project_category_id, project_status_id, username, category_name, status_name, project_created
            FROM project
            JOIN users ON project.user_uuid = users.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            JOIN project_status ON project.project_status_id = project_status.id
            ORDER by project_name ASC`);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des projets");
        }
    }

    // Get projects by the user uuid
    async getUserProjects(req, res) {

        // Check if the user_uuid is provided
        if (!req.params.uuid) {
            res.status(400).json({ error: 'Uuid manquant' });
            return;
        }

        try {

            // Check if the user exists
            const userQuery = await dbQuery('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
            if (userQuery[0].length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            const [results, fields] = await dbQuery(`SELECT project.uuid, project_name, project_description, users.CREATED, users.UPDATED, project_deadline, project_category_id, project_status_id, username, category_name, status_name, project_created FROM project JOIN users ON project.user_uuid = users.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            JOIN project_status ON project.project_status_id = project_status.id WHERE user_uuid = ? 
            ORDER by project_created` , [req.params.uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération du projet");
        }
    }

    // Get a project by his uuid
    async getOne(req, res) {

        // Check if the uuid is provided
        if (!req.params.uuid) {
            res.status(400).json({ error: 'Uuid manquant' });
            return;
        }

        try {
            const [results, fields] = await dbQuery(`SELECT project.uuid, project_name, project_deadline, status_name, username, project_description, project_created, project_updated, category_name, project_category_id, project_status_id, users.uuid AS user_uuid, users.profilePicture as author_profile_picture
            FROM project
            JOIN project_status ON project.project_status_id = project_status.id 
            JOIN users ON project.user_uuid = users.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            WHERE project.uuid = ?`, [req.params.uuid]);

            // Check if the project exists
            if (results.length === 0) {
                return res.status(404).json({ error: 'Projet non trouvé' });
            }

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

        // Check if the project_name, project_description, user_uuid and project_category_id are provided
        if (!newProject.project_name || !newProject.project_description || !newProject.user_uuid || !newProject.project_category_id) {
            res.status(400).json({ error: 'Données manquantes' });
            return;
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

        // Check if the project uuid is provided
        if (!req.params.uuid) {
            res.status(400).json({ error: 'Uuid manquant' });
            return;
        }

        try {

            // Get the statut of the requesting user
            const statutQuery = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            const statut = statutQuery[0][0].statut;


            // Check if the requesting user is the owner of the project or an administrator
            const result = await dbQuery('SELECT user_uuid FROM project WHERE uuid = ?', [req.params.uuid]);
            const user_uuid = result[0][0].user_uuid;
            if (user_uuid !== req.requestingUserUUID && statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
            }

            // Check if the project exists
            const projectQuery = await dbQuery('SELECT * FROM project WHERE uuid = ?', [req.params.uuid]);
            if (projectQuery[0].length === 0) {
                return res.status(404).json({ error: 'Projet non trouvé' });
            }

            // Check if the project has tasks
            const tasksQuery = await dbQuery('SELECT * FROM tasks WHERE project_uuid = ?', [req.params.uuid]);
            if (tasksQuery[0].length > 0) {
                return res.status(400).json({ error: 'Impossible de supprimer un projet contenant des tâches' });
            }

            // Check if the project has members
            const membersQuery = await dbQuery('SELECT * FROM project_members WHERE project_uuid = ?', [req.params.uuid]);
            if (membersQuery[0].length > 0) {
                return res.status(400).json({ error: 'Impossible de supprimer un projet contenant des membres' });
            }

            // Delete the project
            const [results, fields] = await dbQuery('DELETE FROM project WHERE uuid = ?', [req.params.uuid]);
            res.send({ message: 'Deleted', results: results });

        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du projet", error);
        }
    }

    // Update a project by his uuid
    async updateOne(req, res) {

        // Check if project_description, project_status_id, project_deadline and project_category_id are provided
        if (!req.body.project_description || !req.body.project_status_id || !req.body.project_deadline || !req.body.project_category_id) {
            res.status(400).json({ error: 'Données manquantes' });
            return;
        }

        try {

            // Check if the requesting user is the owner of the project
            const result = await dbQuery('SELECT user_uuid FROM project WHERE uuid = ?', [req.params.uuid]);
            const user_uuid = result[0][0].user_uuid;

            if (user_uuid !== req.requestingUserUUID) {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
            }

            // Check if the project exists
            const projectQuery = await dbQuery('SELECT * FROM project WHERE uuid = ?', [req.params.uuid]);
            if (projectQuery[0].length === 0) {
                return res.status(404).json({ error: 'Projet non trouvé' });
            }


            const [results, fields] = await dbQuery('UPDATE project SET project_status_id = ?, project_deadline = ?, project_description = ?, project_category_id = ? WHERE uuid = ?', [req.body.project_status_id, req.body.project_deadline, req.body.project_description, req.body.project_category_id, req.params.uuid]);
            res.send({ message: 'Updated', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du projet", error);
        }
    }
};