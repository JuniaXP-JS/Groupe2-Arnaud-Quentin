// src/routes/user.routes.ts
import { Router } from 'express';
import { getUserInfo } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Authenticated user info
 *       401:
 *         description: Not authenticated
 */
router.get('/me', getUserInfo);

export default router;
