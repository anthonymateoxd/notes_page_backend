import app from './app.js';
import dotenv from 'dotenv';
import { getConnection } from './connection/connection.js';

dotenv.config();

let port = process.env.PORT;
let host = process.env.HOST;

getConnection();
app.listen(port, host);
console.log(`Escuchando en el puerto; ${host}:${port}`);
