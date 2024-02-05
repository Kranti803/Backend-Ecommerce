import express from 'express';
import { isLoggedIn } from './../middlewares/isLoggedIn.js';
import { placeOrder } from '../controllers/orderController.js';
const router = express.Router();

//place new order
router.route('/placeorder').post(isLoggedIn,placeOrder);

export default router;