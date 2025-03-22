import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { fetchRequestedAccounts, fetchUserProfile, searchUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/searchUser', protectRoute, searchUser);
router.get('/fetchUserProfile/:userId', protectRoute, fetchUserProfile);
router.get('/fetchRequestedAccounts', protectRoute, fetchRequestedAccounts);

export default router;