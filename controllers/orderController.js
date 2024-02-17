import { productModel } from '../models/productModel.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { catchAsyncError } from './../middlewares/catchAsynError.js';
import { orderModel } from './../models/orderModel.js';

//place new order
export const placeOrder = catchAsyncError(async (req, res, next) => {

    const { name, email, address, city, phone, orderItems, paymentInfo, subTotal, shippingPrice, totalPrice } = req.body;

    // if (!name || !email || !address || !city || !phone || !orderItems || !paymentInfo || !subTotal || !shippingPrice || !totalPrice) return next(new ErrorHandler('All fields are required', 400));

    await orderModel.create({
        name, email, address, city, phone, orderItems, user: req.user._id, paymentInfo, paidAt: Date.now(), subTotal, shippingPrice, totalPrice
    })
    res.status(201).json({
        success: true,
        message: "Ordered placed successfully"
    })
});

//get all orders --Admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {

    const orders = await orderModel.find();

    res.status(200).json({
        success: true,
        orders
    })

})

//get single order details--Admin
export const getSingleOrderDetails = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) return next(new ErrorHandler("Order doesnot exits", 400));

    res.status(200).json({
        success: true,
        order
    })

})

//get single order --user
export const getSingleOrder = catchAsyncError(async (req, res, next) => {
    const orders = await orderModel.find({}, 'orderItems').populate('orderStatus');

    res.status(200).json({
        success: true,
        orders
    });
});

//delete a order -- admin
export const deleteSingleOrder = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) return next(new ErrorHandler("Order doesnot exist", 400));

    await order.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })

});

//change orderStatus -- admin
export const changeOrderStatus = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) return next(new ErrorHandler("Order doesnot exist", 400));

    if (order.orderStatus === 'Placed') return next(new ErrorHandler("Order is placed already", 400));

    order.orderStatus = "Placed";
    order.deliveredAt = Date.now();


    await order.orderItems.forEach(async (item) => {
        let product = await productModel.findById(item.product);
        product.stock = product.stock - item.quantity;
        await product.save();
    });
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order placed successfully"
    })

});


