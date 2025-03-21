import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { searchUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/searchUser', protectRoute, searchUser);

export default router;