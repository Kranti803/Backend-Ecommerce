import { catchAsyncError } from './../middlewares/catchAsynError.js';
import { orderModel } from './../models/orderModel.js';

//place new order
export const placeOrder = catchAsyncError(async (req, res, next) => {

    const { name, email, address, city, phone, orderItems, paymentInfo, subTotal, shippingPrice, totalPrice } = req.body;

    console.log(name);


    await orderModel.create({
        name, email, address, city, phone, orderItems, user: req.user._id, paymentInfo, paidAt: Date.now(), subTotal, shippingPrice, totalPrice
    })
    res.status(201).json({
        success: true,
        message: "Ordered placed successfully"
    })
});

//get single order