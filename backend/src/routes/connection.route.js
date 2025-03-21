import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { requestConnection } from '../controllers/connection.controller';

const router = express.Router();

router.post('/requestConnection/:status/:toUserId', protectRoute, requestConnection);

export default router;