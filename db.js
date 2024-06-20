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
    if (!this.#connection) {
      this.#connection = await mysql.createConnection(this.#connectionOptions);
    }
    return this;
  }

  // Disconnect from the database
  async disconnect() {
    if (this.#connection) {
      await this.#connection.end();
      this.#connection = null;
    }
  }

  // Query the database
  async query(sql, value) {
    await this.connect();
    const result = await this.#connection.query(sql, value);
    return result;
  }
}

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
  const result = await db.query(sql, value);
  return result;
};
