import multer from 'multer';
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { uploadStory } from '../controllers/story.controller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/uploadStory', protectRoute, upload.single("storyImage"), uploadStory);

export default router;