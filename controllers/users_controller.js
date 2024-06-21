import { dbQuery } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UsersController {
    // List all users
    async listAll(req, res) {

        const requestingUserUUID = req.requestingUserUUID;
        try {
            const [results, fields] = await dbQuery(`
            SELECT uuid, username, email, users.CREATED, lastLogin, statut, bio, profilePicture 
            FROM users 
            WHERE uuid != ?
            ORDER BY users.username`, [requestingUserUUID]);
            res.send(results);
        } catch (err) {
            console.log('Une erreur est survenue lors de la récupération des utilisateurs');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Get one user by his uuid
    async getOne(req, res) {

        // Check if the user uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Uuid manquant' });
        }

        try {
            const [results, fields] = await dbQuery('SELECT username, email, CREATED, lastLogin, status, bio, profilePicture FROM users WHERE uuid = ?', [req.params.uuid]);
            // Check if the user exists
            if (results.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.send(results);
        } catch (err) {
            console.log('Une erreur est survenue lors de la récupération de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Get one user by his username
    async getOneByUsername(req, res) {

        // Check if the user uuid is provided
        if (!req.params.username) {
            return res.status(400).json({ error: 'Nom d\'utilisateur manquant' });
        }

        try {

            const [results, fields] = await dbQuery('SELECT uuid, username, email ,users.CREATED, lastLogin, statut, bio, profilePicture FROM users WHERE username = ?', [req.params.username]);

            // Check if the user exists
            if (results.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.send(results);
        } catch (err) {
            console.log('Une erreur est survenue lors de la récupération de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }


    // Update a user
    async update(req, res) {

        // Check if the user uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Uuid manquant' });
        }

        // Check if uuid, username, email, bio and profilePicture are provided
        if (!req.body.username || !req.body.email) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        // Check if the username length is between 3 and 20 characters
        if (req.body.username.length < 3 || req.body.username.length > 20) {
            return res.status(400).json({ error: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères' });
        }

        // Check if the use bio length is less than 200 characters
        if (req.body.bio && req.body.bio.length > 200) {
            return res.status(400).json({ error: 'La bio ne doit pas dépasser 200 caractères' });
        }


        try {

            // Get the requesting user statut
            const [userStatusResults] = await dbQuery('SELECT statut FROM users WHERE uuid = ?', [req.requestingUserUUID]);
            
            // Check if the user is the owner of the account
            if (req.requestingUserUUID !== req.params.uuid && userStatusResults[0].statut !== 'administrateur') {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
            }

            let statut = null;
            let profilePicture = null;
            let bio = null;

            // Check if the statut is provided
            if (req.body.statut) {
                statut = req.body.statut;
            }

            // Check if the profilePicture is provided
            if (req.body.profilePicture) {
                profilePicture = req.body.profilePicture;
            }

            // Check if the bio is provided
            if (req.body.bio) {
                bio = req.body.bio;
            }

            // Check if the user exists
            const [resultsCheck, fieldsCheck] = await dbQuery('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
            if (resultsCheck.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Update the user
            let query = 'UPDATE users SET username = ?, email = ?';
            let params = [req.body.username, req.body.email];

            if (statut) {
                query += ', statut = ?';
                params.push(statut);
            }

            if (profilePicture) {
                query += ', profilePicture = ?';
                params.push(profilePicture);
            }

            if (bio) {
                query += ', bio = ?';
                params.push(bio);
            }

            query += ' WHERE uuid = ?';
            params.push(req.params.uuid);

            const [results] = await dbQuery(query, params);
            res.json({ message: "User updated", results: results });

        } catch (err) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }


    // Update a user password by his uuid
    async updatePwd(req, res) {

        // Check if the user uuid and the new password are provided
        if (!req.params.uuid || !req.body.pwd) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        // Check if the user is the owner of the account
        if (req.requestingUserUUID !== req.params.uuid) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
        }

        // Hash the new password
        const pwd = await bcrypt.hash(req.body.pwd, 10);

        try {

            // Check if the user exists
            const [resultsCheck, fieldsCheck] = await dbQuery('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
            if (resultsCheck.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Update the user password
            const [results] = await dbQuery('UPDATE users SET pwd = ? WHERE uuid = ?', [pwd, req.params.uuid]);
            res.json({ message: "User updated", results: results });
        } catch (err) {
            console.log('Une erreur est survenue lors de la mise à jour du mot de passe de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Delete a user by his uuid
    async delete(req, res) {

        // Check if the user uuid is provided
        if (!req.params.uuid) {
            return res.status(400).json({ error: 'Uuid manquant' });
        }

        // Check if the user is the owner of the account
        if (req.requestingUserUUID !== req.params.uuid) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à effectuer cette action' });
        }

        try {

            // Check if the user exists
            const [resultsCheck, fieldsCheck] = await dbQuery('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
            if (resultsCheck.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Delete the user
            const [results, fields] = await dbQuery('DELETE FROM users WHERE uuid = ?', [req.params.uuid]);
            res.json({ message: "User deleted", results: results });

        } catch (err) {
            console.log('Une erreur est survenue lors de la suppression de l\'utilisateur');
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // Login a user
    async login(req, res) {

        // Check if the username and the password are provided
        if (!req.body.email || !req.body.pwd) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        try {
            const [results, fields] = await dbQuery('SELECT * FROM users WHERE BINARY email = ?', [req.body.email]);
            if (results.length === 0) {
                return res.status(400).json({ error: 'Wrong email or password' });
            } else {
                const user = results[0];
                const validPwd = await bcrypt.compare(req.body.pwd, user.pwd);
                if (!validPwd) {
                    return res.status(400).json({ error: 'Wrong email or password' });
                }
                req.userUUID = user.uuid;
                const token = jwt.sign({ userUUID: user.uuid }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
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

        // Check if the username, email, password and cgu are provided
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
