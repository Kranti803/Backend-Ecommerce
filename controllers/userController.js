import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { userModel } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";
import { ErrorHandler } from './../utils/ErrorHandler.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from './../utils/sendEmail.js';

//register user
export const registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) return next(new ErrorHandler('All fields are required', 400));

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        return next(new ErrorHandler("User already exists", 409))
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({ name, email, password: hashedPassword });

    sendToken(res, 201, newUser, "User registered successfully");

});

//login user
export const loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) return next(new ErrorHandler('All fields are required', 400));

    const newUser = await userModel.findOne({ email }).select('+password');

    if (!newUser) return next(new ErrorHandler("invalid credentials", 401));

    const isMatched = await bcrypt.compare(password, newUser.password);

    if (!isMatched) return next(new ErrorHandler('Invalid credentials', 401))

    sendToken(res, 200, newUser, "Logged in successfully");

});

//logout user
export const logoutUser = catchAsyncError(async (req, res, next) => {

    res.status(200).cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).json({
        success: true,
        message: "Logged out successfully"
    })

})

//get user's profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {

    const userProfile = await userModel.findById(req.user._id);
    return res.status(200).json({
        userProfile
    })

});

//updateProfile
export const updateMyProfile = catchAsyncError(async (req, res, next) => {

    const { name, email, currentPassword, newPassword } = req.body;

    const user = await userModel.findById(req.user._id).select('+password');

    if (typeof (currentPassword) !== "undefined") {
        const isMatchedPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isMatchedPassword) return next(new ErrorHandler("Current password is incorrect"));
    } else {
        return next(new ErrorHandler("Current password is incorrect"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);


    let updatedUser = await userModel.findByIdAndUpdate(req.user._id, { name, email, password: hashedPassword }, {
        new: true,
        runValidators: true,
    })
    return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        updatedUser
    })

});


//forgot password
export const forgotPassword = catchAsyncError(async (req, res, next) => {

    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Please enter the email address", 400));

    const user = await userModel.findOne({ email });

    if (!user) return next(new ErrorHandler("User doesnot exists", 404));

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordExpire = Date.now() + 3 * 60 * 1000;

    await user.save();

    //sending mail now

    const url = `${process.env.FRONTEND_URL}/resetpassoword/${resetToken}`;
    const text = `Click on the link to reset password : ${url}`;
    await sendEmail('Exclusive', user.email, 'Reset Password', text);

    res.status(200).json({
        success: true,
        message: `Reset link has been sent to : ${user.email}`
    })


})
//reset password
export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { resetToken } = req.params;


    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        }
    })

    if (!user) return next(new ErrorHandler("Reset Password Token is invalid or expired", 401));

    user.password = await bcrypt.hash(req.body.password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })



    res.status(200).json({
        success: true,
        message: `Reset link has been sent to : ${user.email}`
    })


})