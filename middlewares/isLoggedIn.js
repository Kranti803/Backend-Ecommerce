import { userModel } from "../models/userModel.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsynError.js";
import Jwt from "jsonwebtoken";

export const isLoggedIn = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;
    
    if (!token) return next(new ErrorHandler('Please login to get access', 401))

    const decodedData = Jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await userModel.findById(decodedData._id);

    next();
})