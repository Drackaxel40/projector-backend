import { dbQuery } from "../db.js";

export default class ProjectMembersController {
    // List all the project members
    async listAll(req, res) {
        // Check if the project_uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Uuid manquant' });
        }

        try {
            const [results, fields] = await dbQuery(`SELECT project_members.id, users.username, users.uuid, role, lastLogin  FROM project_members 
            JOIN users ON project_members.user_uuid = users.uuid
            JOIN project ON project_members.project_uuid = project.uuid
            WHERE project_uuid = ?
            ORDER BY users.username`, [req.params.uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des membres du projet");
        }
    }

    // Create a new project member
    async create(req, res) {

        // Check if the project_uuid, user_uuid and role are provided
        if (!req.body.project_uuid || !req.body.user_uuid || !req.body.role) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        try {
            // Check if the requesting user is the owner of the project
            const resultsOwner = await dbQuery('SELECT user_uuid FROM project WHERE uuid = ?', [req.body.project_uuid]);
            const projectOwner = resultsOwner[0][0].user_uuid;
            if (projectOwner !== req.requestingUserUUID) {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
            }

            // Check if the user is already a member of the project
            const [resultsCheck, fieldsCheck] = await dbQuery('SELECT * FROM project_members WHERE project_uuid = ? AND user_uuid = ?', [req.body.project_uuid, req.body.user_uuid]);
            if (resultsCheck.length > 0) {
                res.status(400).json({ error: 'L\'utilisateur est déjà membre du projet' });
                return;
            }

            const [results, fields] = await dbQuery('INSERT INTO project_members (project_uuid, user_uuid, role) VALUES (?, ?, ?)', [req.body.project_uuid, req.body.user_uuid, req.body.role]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du membre du projet");
        }
    }

    // Update a project member
    async update(req, res) {
        // Check if the role and the id are provided
        if (!req.body.role || !req.params.id) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Get the project owner
        const resultsOwner = await dbQuery(`SELECT project.user_uuid 
            from project_members
            JOIN project ON project_members.project_uuid = project.uuid
            WHERE id = ?`, [req.params.id]);
        const projectOwner = resultsOwner[0][0].user_uuid;

        // Check if the requesting user is the owner of the project
        if (projectOwner !== req.requestingUserUUID) {
            console.log("Le user n'est pas le propriétaire du projet");
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
        }

        try {
            const [results, fields] = await dbQuery('UPDATE project_members SET role = ? WHERE id = ?', [req.body.role, req.params.id]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour du membre du projet");
        }
    }

    // Delete a project member
    async delete(req, res) {
        // Check if the id is provided
        if (!req.params.id) {
            return res.status(400).json({ error: 'Id manquant' });
        }

        try {
            // Get the project owner
            const resultsOwner = await dbQuery(`SELECT project.user_uuid 
            from project_members
            JOIN project ON project_members.project_uuid = project.uuid
            WHERE id = ?`, [req.params.id]);
            const projectOwner = resultsOwner[0][0].user_uuid;

            // Check if the requesting user is the owner of the project
            if (projectOwner !== req.requestingUserUUID) {
                console.log("Le user n'est pas le propriétaire du projet");
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
            }

            const [results, fields] = await dbQuery('DELETE FROM project_members WHERE id = ?', [req.params.id]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du membre du projet");
        }
    }

    // Get all the projects where the user is a member
    async getUserProjects(req, res) {
        // Check if the user_uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        try {
            const [results, fields] = await dbQuery(`SELECT project.uuid, project.project_name, project.project_description, project_members.role,project_created , project_category_id, category_name FROM project_members 
            JOIN project ON project_members.project_uuid = project.uuid
            JOIN project_categories ON project.project_category_id = project_categories.id
            WHERE project_members.user_uuid = ?`, [req.params.uuid]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des projets de l'utilisateur", error);
        }
    }
}