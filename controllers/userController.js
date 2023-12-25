import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { userModel } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";
import { ErrorHandler } from './../utils/ErrorHandler.js';
import bcrypt from 'bcrypt';

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