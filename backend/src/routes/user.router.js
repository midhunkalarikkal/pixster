import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { fetchFollowingAccounts, fetchNotifications, fetchRequestedAccounts, fetchSearchedUserProfile, searchUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/searchUser', protectRoute, searchUser);
router.get('/fetchSearchedUserProfile/:userId', protectRoute, fetchSearchedUserProfile);
router.get('/fetchRequestedProfiles', protectRoute, fetchRequestedAccounts);
router.get('/fetchFollowingProfiles', protectRoute, fetchFollowingAccounts);
router.get('/fetchNotifications', protectRoute, fetchNotifications);

export default router;