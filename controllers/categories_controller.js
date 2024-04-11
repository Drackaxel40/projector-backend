import { dbQuery } from "../db.js";

export default class CategoriesController {
    // List all categories
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM project_categories');
        res.send(results);
    }

    // Delete one category by his id
    async delete(req, res) {
        const [results, fields] = await dbQuery('DELETE FROM project_categories WHERE id = ?', [req.params.id]);
        res.send({message: 'Deleted', results: results});
    }

    // Create a new category
    async create(req, res) {
        const newCategory = {
            category_name: req.body.category_name
        };

        const [results, fields] = await dbQuery('INSERT INTO project_categories (category_name) VALUES (?)', [newCategory.category_name]);
        res.send({message: 'Created', results: results});
    }

    // Update a category by his id
    async update(req, res) {
        const [results, fields] = await dbQuery('UPDATE project_categories SET category_name = ? WHERE id = ?', [req.body.category_name, req.params.id]);
        res.send({message: 'Updated', results: results});
    }
}