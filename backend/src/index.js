import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';

dotenv.config();
const app = express();

app.use(express.json());
// app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

const PORT = process.env.PORT;

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

app.listen(PORT,() => {
    console.log(`Server is running on post ${PORT}`);
    connectDB();
})