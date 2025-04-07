import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptConnection, cancelConnection, rejectConnection, requestConnection, unfollowConnection } from '../controllers/connection.controller.js';

const router = express.Router();

router.post('/sendConnectionRequest/:toUserId', protectRoute, requestConnection);
router.post('/acceptConnectionRequest/:toUserId', protectRoute, acceptConnection);
router.post('/rejectConnectionRequest/:toUserId', protectRoute, rejectConnection);
router.post('/cancelConnectionRequest/:toUserId', protectRoute, cancelConnection);
router.post('/unFollowConnectionRequest/:toUserId', protectRoute, unfollowConnection);

export default router;