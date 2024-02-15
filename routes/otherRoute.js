import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { contactUs, getAllProducts, getAllUsers, getDashboardStats } from '../controllers/otherController.js';
import { isAdmin } from './../middlewares/isAdmin.js';
const router = express.Router();

//contact us route
router.route('/contact').post(isLoggedIn,contactUs);

//dashboard stats
router.route('/dashboard_stats').get(isLoggedIn,isAdmin,getDashboardStats);

//getAllUsers--admin
router.route('/dashboard_stats/allusers').get(isLoggedIn,isAdmin,getAllUsers);

//getAllProducts--admin
router.route('/dashboard_stats/allproducts').get(isLoggedIn,isAdmin,getAllProducts);

export default router;