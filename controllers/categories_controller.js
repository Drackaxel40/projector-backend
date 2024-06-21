import { dbQuery } from "../db.js";

export default class CategoriesController {
    // List all categories
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT * FROM project_categories ORDER BY category_name ASC');
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des catégories");
        }
    }

    // Create a new category
    async create(req, res) {

        // Check if the category_name is provided
        if (!req.body.category_name) return res.status(400).json({ error: 'Nom de catégorie manquant' });

        try {
            // Check if the user is an administrator
            const result = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            const statut = result[0][0].statut;
            if (statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            }

            const newCategory = {
                category_name: req.body.category_name
            };

            const [results, fields] = await dbQuery('INSERT INTO project_categories (category_name) VALUES (?)', [newCategory.category_name]);
            res.send({ message: 'Created', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création de la catégorie");
        }
    }

    // Update a category by his id
    async update(req, res) {

        // Check if the id and the category_name are provided
        if (!req.params.id || !req.body.category_name) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        try {

            // Check if the user is an administrator
            const result = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            const statut = result[0][0].statut;
            if (statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            }

            // Check if the category exists
            const [categoryResults, categoryFields] = await dbQuery('SELECT * FROM project_categories WHERE id = ?', [req.params.id]);
            if (categoryResults.length === 0) {
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            // Update the category
            const [results, fields] = await dbQuery('UPDATE project_categories SET category_name = ? WHERE id = ?', [req.body.category_name, req.params.id]);
            res.send({ message: 'Updated', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour de la catégorie");
        }
    }

    // Delete one category by his id
    async delete(req, res) {

        // Check if the id is provided
        if (!req.params.id) return res.status(400).json({ error: 'Id manquant' });

        try {
            // Check if the user is an administrator
            const result = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            const statut = result[0][0].statut;
            if (statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'avez pas les droits pour effectuer cette action' });
            }

            // Check if the category exists
            const [categoryResults, categoryFields] = await dbQuery('SELECT * FROM project_categories WHERE id = ?', [req.params.id]);
            if (categoryResults.length === 0) {
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            // Delete the category
            const [results, fields] = await dbQuery('DELETE FROM project_categories WHERE id = ?', [req.params.id]);
            res.send({ message: 'Deleted', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression de la catégorie");
        }
    }
}