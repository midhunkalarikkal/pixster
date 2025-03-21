import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { requestConnection } from '../controllers/connection.controller.js';

const router = express.Router();

router.post('/requestConnection/:status/:toUserId', protectRoute, requestConnection);

export default router;