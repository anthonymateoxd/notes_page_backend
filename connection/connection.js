import mysql from 'mysql2/promise';

const dbSettings = {
  host: 'mysql', // use 'mysql' (container name) instead of localhost if running in Docker
  user: 'root', // your MySQL username
  password: 'guest', // your MySQL password
  database: 'app', // your database (created in docker-compose)
  port: 3306, // default MySQL port
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones en el pool
  acquireTimeout: 60000, // ✅ válido aquí
  connectTimeout: 60000,
};

export const getConnection = async () => {
  try {
    const pool = mysql.createPool(dbSettings);
    return pool;
  } catch (error) {
    console.error('Error de conexion Mysql', error);
  }
};
