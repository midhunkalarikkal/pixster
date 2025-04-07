import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptConnection, requestConnection } from '../controllers/connection.controller.js';

const router = express.Router();

router.post('/sendConnectionRequest/:toUserId', protectRoute, requestConnection);
router.post('/acceptConnectionRequest/:toUserId', protectRoute, acceptConnection);

export default router;