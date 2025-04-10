import multer from 'multer';
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { fetchFollowersAccounts, fetchFollowingAccounts, fetchNotifications, fetchRequestedAccounts, fetchSearchedUserProfile, fetchSuggestions, searchUsers, uploadPost } from '../controllers/user.controller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/searchUsers', protectRoute, searchUsers);
router.get('/fetchSearchedUserProfile/:userId', protectRoute, fetchSearchedUserProfile);
router.get('/fetchRequestedProfiles', protectRoute, fetchRequestedAccounts);
router.get('/fetchFollowingProfiles/:userId', protectRoute, fetchFollowingAccounts);
router.get('/fetchFollowersProfiles/:userId', protectRoute, fetchFollowersAccounts);
router.get('/fetchNotifications', protectRoute, fetchNotifications);
router.get('/getSuggestions', protectRoute, fetchSuggestions);
router.post('/uploadPost', protectRoute, upload.single('postImage'), uploadPost);

export default router;