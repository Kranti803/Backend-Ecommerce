import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { contactUs } from '../controllers/otherController.js';
const router = express.Router();

//contact us route
router.route('/contact').post(isLoggedIn,contactUs);

export default router;