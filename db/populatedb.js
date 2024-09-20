const { Client } = require( 'pg' );
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const SQL = `
    CREATE TYPE membership_status AS ENUM ('basic', 'admin');

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR (255),
        last_name VARCHAR (255),
        username VARCHAR (255),
        password VARCHAR (255),
        mem_status membership_status DEFAULT 'basic'
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR (255),
        text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`

const SQL_CHECK_ADMIN = `SELECT * FROM users WHERE mem_status = 'admin' LIMIT 1`;

const SQL_INSERT_ADMIN = `
    INSERT INTO users (first_name, last_name, username, password, mem_status)
    VALUES ($1, $2, $3, $4, 'admin')
`;

async function createAdmin(client) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await client.query(SQL_INSERT_ADMIN, [
        process.env.ADMIN_FIRST_NAME,
        process.env.ADMIN_LAST_NAME,
        process.env.ADMIN_USERNAME,
        hashedPassword
    ]);
    console.log("Admin user created successfully.");
}

async function main() {
    try {
        console.log("Seeding...");
        const client = new Client({
            connectionString: process.env.DB_URL
        });

        await client.connect();
        await client.query(SQL);

        //check if admin already exists
        const adminCheck = await client.query(SQL_CHECK_ADMIN);
        if (adminCheck.rows.length === 0) {
            await createAdmin(client);
        } else {
            console.log("Admin user already exists.");
        }

        await client.end();
        console.log("DB seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

main();