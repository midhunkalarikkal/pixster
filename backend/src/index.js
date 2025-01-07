import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';

import authRouter from './routes/auth.route.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use('/api/auth', authRouter);

app.use(express.json());

app.listen(PORT,() => {
    console.log(`Server is running on post ${PORT}`);
    connectDB();
})