import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { contactUs, getDashboardStats } from '../controllers/otherController.js';
import { isAdmin } from './../middlewares/isAdmin.js';
const router = express.Router();

//contact us route
router.route('/contact').post(isLoggedIn,contactUs);

//dashboard stats
router.route('/dashboard_stats').get(isLoggedIn,isAdmin,getDashboardStats)

export default router;