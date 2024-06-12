import express from 'express';
import { isLoggedIn } from './../middlewares/isLoggedIn.js';
import { changeOrderStatus, deleteSingleOrder, getAllOrders, getSingleOrder, getSingleOrderDetails, placeOrder } from '../controllers/orderController.js';
import { isAdmin } from './../middlewares/isAdmin.js';
const router = express.Router();

//place new order
router.route('/placeorder').post(isLoggedIn, placeOrder);

//get all orders
router.route('/get_all_orders').get(isLoggedIn, isAdmin, getAllOrders);

//get single order details--admin
router.route('/orderdetails/:id').get(isLoggedIn, isAdmin, getSingleOrderDetails);

//get single order--user
router.route('/orders').get(isLoggedIn, getSingleOrder);

//delete single order--admin
router.route('/deleteorder/:id').delete(isLoggedIn, isAdmin, deleteSingleOrder);

//change order status
router.route('/updateorder/:id').put(isLoggedIn, isAdmin, changeOrderStatus);

export default router;