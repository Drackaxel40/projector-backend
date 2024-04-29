import { dbQuery } from "../db.js";

export default class ProjectMembersController {
    // List all the project members
    async listAll(req, res) {
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

        // Check if the user is already a member of the project
        const [resultsCheck, fieldsCheck] = await dbQuery('SELECT * FROM project_members WHERE project_uuid = ? AND user_uuid = ?', [req.body.project_uuid, req.body.user_uuid]);
        if (resultsCheck.length > 0) {
            res.status(400).json({ error: 'L\'utilisateur est déjà membre du projet' });
            return;
        }

        try {
            const [results, fields] = await dbQuery('INSERT INTO project_members (project_uuid, user_uuid, role) VALUES (?, ?, ?)', [req.body.project_uuid, req.body.user_uuid, req.body.role]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création du membre du projet");
        }
    }

    // Update a project member
    async update(req, res) {
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
        try {
            const [results, fields] = await dbQuery('DELETE FROM project_members WHERE id = ?', [req.params.id]);
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression du membre du projet");
        }
    }
}