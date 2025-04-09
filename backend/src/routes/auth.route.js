import multer from 'multer';
import express from 'express';
import cloudinaryConfig from '../lib/cloudinary.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkAuth, login, logout, removeProfile, signup, updateProfile } from '../controllers/auth.controller.js';

// const { upload } = cloudinaryConfig;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/signup', signup);

router.post('/login',login);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, upload.single('profilePic'), updateProfile);

router.put('/remove-profile', protectRoute, removeProfile);

router.get('/check', protectRoute, checkAuth);

export default router;