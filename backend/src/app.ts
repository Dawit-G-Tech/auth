import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/en', apiRouter);
app.use('/am', apiRouter);

app.use(errorMiddleware);

export default app;
