import { dbQuery } from '../db.js';

export default class UsersController {
    // List all users
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT username, email, CREATED, lastLogin FROM users');
        res.send(results);
    }

    // Get one user by his uuid
    async getOne(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
        res.send(results);
    }

    // Create a new user
    async create(req, res) {s
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            pwd: req.body.pwd,
            cgu: req.body.cgu
        };

        const [results, fields] = await dbQuery('INSERT INTO users (uuid, username, email, pwd, cgu) VALUES (UUID(), ?, ?, ?, ?)', [newUser.username, newUser.email, newUser.pwd, newUser.cgu]);
         res.json({message: "User added", results: results});
    }

    // Update a user username by his uuid
    async updateUsername (req, res) {
        const [results] = await dbQuery('UPDATE users SET username = ? WHERE uuid = ?', [req.body.username, req.params.uuid]);
        res.json({message: "User updated", results: results});
    }

    // Update a user email by his uuid
    async updateEmail (req, res) {
        const [results] = await dbQuery('UPDATE users SET email = ? WHERE uuid = ?', [req.body.email, req.params.uuid]);
        res.json({message: "User updated", results: results});
    }

    // Update a user password by his uuid
    async updatePwd (req, res) {
        const [results] = await dbQuery('UPDATE users SET pwd = ? WHERE uuid = ?', [req.body.pwd, req.params.uuid]);
        res.json({message: "User updated", results: results});
    }

    // Delete a user by his uuid
    async delete (req, res) {
        const [results, fields] = await dbQuery('DELETE FROM users WHERE uuid = ?', [req.params.uuid]);
        res.json({message: "User deleted", results: results});
    }
}
