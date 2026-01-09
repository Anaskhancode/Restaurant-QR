import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import checkRole from '../middlewares/checkRole.js';
import { getDashboardStats } from '../controllers/admin.controller.js';


const router = express.Router();

router.get('/admin/dashboard-stats',verifyToken,checkRole(['admin']), getDashboardStats);

export default router;
