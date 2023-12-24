import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { userModel } from "../models/userModel.js";
import { ErrorHandler } from './../utils/ErrorHandler.js';

export const registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;
    
    if (!name || !email || !password) return next(new ErrorHandler('All fields are required', 400));

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        return next(new ErrorHandler("User already exists", 409))
    }
    const newUser = await userModel.create({ name, email, password });

    return res.status(200).json({
        success: true,
        message: "User registered successfully",
        newUser
    })

})