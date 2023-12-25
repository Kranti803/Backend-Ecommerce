import { ErrorHandler } from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsynError.js";

export const isAdmin = catchAsyncError(async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new ErrorHandler('User is not allowed to access', 403));
    next();
})