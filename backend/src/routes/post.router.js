import multer from 'multer';
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { deletePost, likeOrDislikePost, updatePost, uploadPost } from '../controllers/post.controller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/uploadPost', protectRoute, upload.single('postImage'), uploadPost);
router.delete('/deletePost/:postId', protectRoute, deletePost);
router.post('/updatePost/:postId',protectRoute, upload.single('postImage'), updatePost);
router.put(`/likeOrDislikePost/:postId`, protectRoute, likeOrDislikePost);

export default router;