import { dbQuery } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UsersController {
    // List all users
    async listAll(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT uuid, username, email, users.CREATED, lastLogin, statut, bio, profilePicture FROM users ORDER BY users.username');
            res.send(results);
        } catch (err) {
            console.log('Une erreur est survenue lors de la récupération des utilisateurs');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Get one user by his uuid
    async getOne(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT username, email, CREATED, lastLogin, status, bio, profilePicture FROM users WHERE uuid = ?', [req.params.uuid]);
            res.send(results);
        } catch (err) {
            console.log('Une erreur est survenue lors de la récupération de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Get one user by his username
    async getOneByUsername(req, res) {
        try {
            const [results, fields] = await dbQuery('SELECT uuid, username, email ,users.CREATED, lastLogin, statut, bio, profilePicture FROM users WHERE username = ?', [req.params.username]);
            res.send(results);
        } catch (err) {
            console.log('Une erreur est survenue lors de la récupération de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }


    // Update a user
    async update(req, res) {
        try {
            const [results] = await dbQuery('UPDATE users SET username = ?, email = ?, bio = ?, profilePicture = ? WHERE uuid = ?', [req.body.username, req.body.email, req.body.bio, req.body.profilePicture, req.params.uuid]);
            res.json({ message: "User updated", results: results });
        } catch (err) {
            console.log('Une erreur est survenue lors de la mise à jour du nom d\'utilisateur de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }

    }

    // Update a user password by his uuid
    async updatePwd(req, res) {
        const pwd = await bcrypt.hash(req.body.pwd, 10);

        try {
            const [results] = await dbQuery('UPDATE users SET pwd = ? WHERE uuid = ?', [pwd, req.params.uuid]);
            res.json({ message: "User updated", results: results });
        } catch (err) {
            console.log('Une erreur est survenue lors de la mise à jour du mot de passe de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Delete a user by his uuid
    async delete(req, res) {
        try {
            const [results, fields] = await dbQuery('DELETE FROM users WHERE uuid = ?', [req.params.uuid]);
            res.json({ message: "User deleted", results: results });
        } catch (err) {
            console.log('Une erreur est survenue lors de la suppression de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Login a user
    async login(req, res) {
        if (!req.body.username || !req.body.pwd) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        try {
            const [results, fields] = await dbQuery('SELECT * FROM users WHERE BINARY username = ?', [req.body.username]);
            if (results.length === 0) {
                return res.status(400).json({ error: 'Wrong username or password' });
            } else {
                const user = results[0];
                const validPwd = await bcrypt.compare(req.body.pwd, user.pwd);
                if (!validPwd) {
                    return res.status(400).json({ error: 'Wrong username or password' });
                }
                req.userUUID = user.uuid;
                const token = jwt.sign({ userUUID: user.uuid }, process.env.JWT_SECRET_KEY);
                // Include token in the response body
                res.header('Authorization', token).json({ message: 'Login successful', token: token, username: user.username, email: user.email, uuid: user.uuid, statut: user.statut, bio: user.bio, profilePicture: user.profilePicture });

                // Update last login date
                await dbQuery('UPDATE users SET lastLogin = NOW() WHERE uuid = ?', [user.uuid]);
            }
        } catch (err) {
            console.log('Une erreur est survenue lors de la connexion de l\'utilisateur');
        }
    }


    // Create a new user
    async create(req, res) {

        // Validate request body
        if (!req.body.username || !req.body.email || !req.body.pwd || !req.body.cgu) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        const newUser = {
            username: req.body.username,
            email: req.body.email,
            pwd: await bcrypt.hash(req.body.pwd, 10),
            cgu: req.body.cgu
        };

        const lowerCaseUsername = newUser.username.toLowerCase();

        try {

            const [resultsMail] = await dbQuery('SELECT * FROM users WHERE email = ?', [newUser.email]);
            const [resultsUsername] = await dbQuery('SELECT * FROM users WHERE LOWER(username) = ?', [lowerCaseUsername]);

            if (resultsMail.length > 0) {
                return res.status(400).json({ error: 'Cette adresse email est déjà utilisée.' });
            }

            if (resultsUsername.length > 0) {
                return res.status(400).json({ error: 'Ce pseudo est déjà utilisé. Merci de choisir un autre.' });
            }

            const [results] = await dbQuery('INSERT INTO users (uuid, username, email, pwd, cgu) VALUES (UUID(), ?, ?, ?, ?)', [newUser.username, newUser.email, newUser.pwd, newUser.cgu]);
            res.json({ message: "Utilisateur crée avec success", results: results });


        } catch (err) {
            console.log(err, 'Une erreur est survenue lors de la création de l\'utilisateur', err);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }


}
