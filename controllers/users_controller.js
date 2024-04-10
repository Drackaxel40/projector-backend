import { dbQuery } from '../db.js';

export default class UsersController {
    async listAll(req, res) {
        const [results, fields] = await dbQuery('SELECT * FROM users');
        res.send(results);
    }

    delete(req, res) {
        res.send('delete');
    }
}
