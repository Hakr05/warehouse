import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'your_username',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'your_database',
  password: process.env.DB_PASSWORD || 'your_password',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Function to query the database
export async function queryDatabase<T extends QueryResultRow>(
  query: string,
  params?: any[]
): Promise<QueryResult<T>> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect(); // Get a client from the pool
    const result = await client.query<T>(query, params); // Execute the query
    return result; // Return query result
  } catch (err) {
    console.error('Database query error:', err.stack);
    throw err; // Rethrow error for further handling
  } finally {
    if (client) client.release(); // Ensure the client is released back to the pool
  }
}

// Example usage
async function fetchUsers(): Promise<void> {
  try {
    const result = await queryDatabase<{ id: number; name: string }>(
      'SELECT id, name FROM users'
    );
    console.log('Users:', result.rows); // Output the result
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }
}

fetchUsers(); // Call the example function
