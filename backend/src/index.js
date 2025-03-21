import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';

import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
// import connectionRouter from './routes/connection.route.js';
import { app, server } from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({
    limit: '50mb'
  }));
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));


app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);
// app.use('/api/connection', connectionRouter);

server.listen(PORT,() => {
    console.log(`Server is running on post ${PORT}`);
    connectDB();
})