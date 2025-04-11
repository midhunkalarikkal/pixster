import multer from 'multer';
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { deletePost, uploadPost } from '../controllers/post.controller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/uploadPost', protectRoute, upload.single('postImage'), uploadPost);
router.delete('/deletePost/:postId', protectRoute, deletePost);

export default router;