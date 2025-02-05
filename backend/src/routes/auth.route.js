import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import cloudinaryConfig from '../lib/cloudinary.js';

const { upload } = cloudinaryConfig;

const router = express.Router();

router.post('/signup', signup);

router.post('/login',login);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, upload.single('profilePic'), updateProfile);

router.get('/check', protectRoute, checkAuth);

export default router;