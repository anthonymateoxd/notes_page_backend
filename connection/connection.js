import mysql from 'mysql2/promise';

const dbSettings = {
  host: 'localhost', // use 'mysql' (container name) instead of localhost if running in Docker
  user: 'root', // your MySQL username
  password: 'guest', // your MySQL password
  database: 'app', // your database (created in docker-compose)
  port: 3306, // default MySQL port
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones en el pool
  queueLimit: 0, // Límite de solicitudes en cola (0 = sin límite)
  acquireTimeout: 60000, // Tiempo máximo para obtener conexión (60 segundos)
  connectTimeout: 60000, // 60 segundos para establecer conexión
};

export const getConnection = async () => {
  try {
    const pool = mysql.createPool(dbSettings);
    return pool;
  } catch (error) {
    console.error('Error de conexion Mysql', error);
  }
};
