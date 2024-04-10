import { dbQuery } from '../db.js';

export default class UsersController {
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM users');
        res.send(results);
    }

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

    async update (req, res) {
        const [results] = await dbQuery('UPDATE users SET username = ?, email = ? WHERE uuid = ?', [req.body.username, req.body.email, req.params.uuid]);
        res.json({message: "User updated", results: results});
    }

    async delete (req, res) {
        const [results, fields] = await dbQuery('DELETE FROM users WHERE uuid = ?', [req.params.uuid]);
        res.json({message: "User deleted", results: results});
    }
}
