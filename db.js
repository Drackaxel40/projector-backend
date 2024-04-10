import mysql from 'mysql2/promise';

// Database class
class DB {
    // private to avoid misuse in client code
    #connection;
    #connectionOptions;

    constructor(connectionOptionsArg) {
        this.#connectionOptions = connectionOptionsArg;
    }

    // Connect to the database
    async connect() {
        this.#connection = await mysql.createConnection(this.#connectionOptions);
        return this;
    }

    // Disconnect from the database
    disconnect() {
        this.#connection.destroy();
    }

    // Query the database
    query(sql, value) {
        return this.#connection.query(sql, value);
    }
};

// Get the connection options from the environment
const db = new DB({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Export the database query function
export const dbQuery = async (sql, value) => {
  await db.connect();
  const result = await db.query(sql, value);
  db.disconnect();
  return result;
}