import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';

import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

app.listen(PORT,() => {
    console.log(`Server is running on post ${PORT}`);
    connectDB();
})