import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { changeRole, contactUs, deleteUser, getAllProducts, getAllUsers, getDashboardStats,makeStripePayment } from '../controllers/otherController.js';
import { isAdmin } from './../middlewares/isAdmin.js';
const router = express.Router();

//contact us
router.route('/contact').post(isLoggedIn, contactUs);

//dashboard stats--admin
router.route('/dashboard_stats').get(isLoggedIn, isAdmin, getDashboardStats);

//getAllUsers--admin
router.route('/dashboard_stats/allusers').get(isLoggedIn, isAdmin, getAllUsers);

//getAllProducts--admin
router.route('/dashboard_stats/allproducts').get(isLoggedIn, isAdmin, getAllProducts);

//delete user --admin
router.route('/admin/deleteuser/:id').delete(isLoggedIn, isAdmin, deleteUser)

//change user role--admin
router.route('/admin/changerole/:id').put(isLoggedIn, isAdmin, changeRole)


//make stripe payment
router.route('/create-checkout-session').post(isLoggedIn, makeStripePayment);



export default router;