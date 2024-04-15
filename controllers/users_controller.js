import { dbQuery } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    async create(req, res) {
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            pwd: await bcrypt.hash(req.body.pwd, 10),
            cgu: req.body.cgu
        };

        const [results, fields] = await dbQuery('INSERT INTO users (uuid, username, email, pwd, cgu) VALUES (UUID(), ?, ?, ?, ?)', [newUser.username, newUser.email, newUser.pwd, newUser.cgu]);
         res.json({message: "User created successfully", results: results});
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

    // Login a user
    async login (req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM users WHERE username = ?', [req.body.username]);
        if (results.length === 0) {
            return res.status(400).json({error: 'User not found'});
        } else {
            const user = results[0];
            const validPwd = await bcrypt.compare(req.body.pwd, user.pwd);
            if (!validPwd) {
                return res.status(400).json({error: 'Invalid password'});
            }
            req.userUUID = user.uuid;
            const token = jwt.sign({userUUID: user.uuid}, process.env.JWT_SECRET_KEY);
            // Include token in the response body
            res.header('Authorization', token).json({message: 'Login successful', token: token, username: user.username, email: user.email, uuid: user.uuid});
        }
    }
}
