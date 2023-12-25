import express from 'express';
const router = express.Router();
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from './../middlewares/isAdmin.js';

//register user route
router.route('/register').post(registerUser);
//login user route
router.route('/login').post(loginUser);
//logout user route
router.route('/logout').get(isLoggedIn,logoutUser);





export default router;