import { Router } from 'express';
import { register, login, refresh, logout, googleAuth, googleCallback } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Social auth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;


