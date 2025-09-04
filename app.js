import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

dotenv.config();

let port = process.env.REACT_APP_PORT || 8080;
let host = process.env.REACT_APP_HOST || '0.0.0.0';

app.use(
  cors({
    origin: [`http://${host}:${port}`, `http://localhost:8080`],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/api', routes);

export default app;
