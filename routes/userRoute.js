import express from 'express';
const router = express.Router();
import { forgotPassword, getMyProfile, loginUser, logoutUser, registerUser, resetPassword, updateMyProfile, verifyTheEmail } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
// import { isAdmin } from './../middlewares/isAdmin.js';

//register user route
router.route('/register').post(registerUser);

//verify the email token
router.route('/:id/emailverify/:token').get(verifyTheEmail)

//login user route
router.route('/login').post(loginUser);

//logout user route
router.route('/logout').get(isLoggedIn, logoutUser);

//get user's profile
router.route('/profile').get(isLoggedIn, getMyProfile);

//update user profile
router.route('/updateprofile').put(isLoggedIn, updateMyProfile);

//forgot password
router.route('/forgotpassword').post(forgotPassword);

//reset password
router.route('/resetpassword/:resetToken').post(resetPassword);





export default router;