/**
 * OPTIMIZED Database Connection with Connection Pooling
 * Replaces slow sqlcmd execution with proper mssql driver connection pooling
 */

import sql from 'mssql';
import { SERVER, DATABASE } from './dbConfig.js';

let pool = null;

/**
 * Initialize connection pool
 */
async function initializePool() {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    pool = new sql.ConnectionPool({
      server: SERVER,
      database: DATABASE,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.DB_USER || 'sa',
          password: process.env.DB_PASSWORD,
        },
      },
      options: {
        encrypt: false, // Set to true if using encrypted connections
        trustServerCertificate: true,
        connectTimeout: 15000,
        requestTimeout: 30000,
        pool: {
          min: 2,
          max: 10,
        },
      },
    });

    pool.on('error', (err) => {
      console.error('Connection pool error:', err);
      pool = null;
    });

    await pool.connect();
    console.log('Database connection pool initialized');
    return pool;
  } catch (err) {
    console.error('Failed to initialize connection pool:', err);
    pool = null;
    throw err;
  }
}

/**
 * Execute query with connection pooling
 */
export async function executeQuery(query) {
  try {
    const connectionPool = await initializePool();
    const request = connectionPool.request();
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Query execution error:', err);
    throw err;
  }
}

/**
 * Execute query with parameters (prevents SQL injection)
 */
export async function executeQueryWithParams(query, params = {}) {
  try {
    const connectionPool = await initializePool();
    let request = connectionPool.request();

    // Add parameters
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Query execution error:', err);
    throw err;
  }
}

/**
 * Close connection pool
 */
export async function closePool() {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      console.log('Connection pool closed');
    } catch (err) {
      console.error('Error closing pool:', err);
    }
  }
}

export { pool };
