import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { fetchFollowingAccounts, fetchNotifications, fetchRequestedAccounts, fetchSearchedUserProfile, fetchSuggestions, searchUsers, uploadPost } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/searchUsers', protectRoute, searchUsers);
router.get('/fetchSearchedUserProfile/:userId', protectRoute, fetchSearchedUserProfile);
router.get('/fetchRequestedProfiles', protectRoute, fetchRequestedAccounts);
router.get('/fetchFollowingProfiles', protectRoute, fetchFollowingAccounts);
router.get('/fetchNotifications', protectRoute, fetchNotifications);
router.get('/getSuggestions', protectRoute, fetchSuggestions);
router.post('/uploadPost', protectRoute, uploadPost);

export default router;