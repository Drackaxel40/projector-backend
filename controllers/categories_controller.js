import { dbQuery } from "../db.js";

export default class CategoriesController {
    // List all categories
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT * FROM project_categories');
            res.send(results);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la récupération des catégories");
        }
    }

    // Delete one category by his id
    async delete(req, res) {
        try {
            const [results, fields] = await dbQuery('DELETE FROM project_categories WHERE id = ?', [req.params.id]);
            res.send({ message: 'Deleted', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la suppression de la catégorie");
        }
    }

    // Create a new category
    async create(req, res) {

        const newCategory = {
            category_name: req.body.category_name
        };

        try {
            const [results, fields] = await dbQuery('INSERT INTO project_categories (category_name) VALUES (?)', [newCategory.category_name]);
            res.send({ message: 'Created', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la création de la catégorie");
        }
    }

    // Update a category by his id
    async update(req, res) {
        try {
            const [results, fields] = await dbQuery('UPDATE project_categories SET category_name = ? WHERE id = ?', [req.body.category_name, req.params.id]);
            res.send({ message: 'Updated', results: results });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
            console.log("Une erreur est survenue lors de la mise à jour de la catégorie");
        }
    }
}