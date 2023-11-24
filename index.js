import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import moviesRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import stackRoutes from './routes/stacks.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/movies', moviesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stacks/', stackRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });