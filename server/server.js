import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routers/router.js';
import corsMiddle from './middleware/corsMiddleware.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(corsMiddle);

app.use(express.static(path.join(__dirname, '../client/public')));

app.use('/api', router);
app.get('/*', (req, res) => {
  res.send('Wrong path');
});

mongoose
  .connect(process.env.DB)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error('MongoDB connection error:', error));
