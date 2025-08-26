import 'dotenv/config.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import { httpLogger } from './config/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(httpLogger);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('DB connection failed', err); 
    process.exit(1);
  });
