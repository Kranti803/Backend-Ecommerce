import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { productModel } from "../models/productModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { orderModel } from './../models/orderModel.js';
import { userModel } from './../models/userModel.js';
import { ErrorHandler } from './../utils/ErrorHandler.js';

//contact us
export const contactUs = catchAsyncError(async (req, res) => {

    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) return next(new ErrorHandler("All fields are required !", 400));

    const from = `${phone} ${email}`;
    const to = process.env.SMTP_USER;
    const subject = name;
    const text = message;
    await sendEmail(from, to, subject, text);

    res.status(200).json({
        success: true,
        message: "Your message has been sent successfully"
    })

})

//get DashboardStats
export const getDashboardStats = catchAsyncError(async (req, res, next) => {

    const totalProduct = await productModel.countDocuments();
    const totalUser = await userModel.countDocuments();
    const totalOrder = await orderModel.countDocuments();
    const orders = await orderModel.find();

    //filtering the placed orders
    const placedOrders = orders.filter((order) => order.orderStatus = 'Placed');
    let totalPrice = placedOrders.reduce((total, currentItem) => {
        return total + currentItem.totalPrice
    }, 0)

    // Group orders by month and calculate totalRevenue and totalOrders
    const monthlyStats = {};
    orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const month = orderDate.getMonth(); // JavaScript months are 0-indexed
        const year = orderDate.getFullYear();
        const key = `${year}-${month}`;

        if (!monthlyStats[key]) {
            monthlyStats[key] = {
                month,
                year,
                totalRevenue: 0,
                totalOrders: 0
            };
        }

        monthlyStats[key].totalRevenue += order.totalPrice;
        monthlyStats[key].totalOrders += 1;
    });
    const monthlyStatsArray = Object.values(monthlyStats).sort((a, b) => { //object.values converts object into array
        return a.year - b.year || a.month - b.month; // Sorting by year and then by month
    });

    //getting the total no. of inStock and outOfStock products
    const products = await productModel.find();
    const inStockProducts = products.filter((product) => product.stock !== 0);
    const outOfStockproducts = products.length - inStockProducts.length;


    res.status(200).json({
        success: true,
        totalOrder,
        totalUser,
        totalProduct,
        inStockProducts: inStockProducts.length,
        outOfStockproducts,
        totalRevenue: totalPrice,
        monthlyStats: monthlyStatsArray
    });


});

//get all users --admin
export const getAllUsers = catchAsyncError(async (req, res) => {
    const users = await userModel.find();
    res.status(200).json({
        success: true,
        users
    })
})

//get all products --admin
export const getAllProducts = catchAsyncError(async (req, res) => {
    const products = await productModel.find();
    res.status(200).json({
        success: true,
        products
    })
})


//delete user --admin
export const deleteUser = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) return next(new ErrorHandler("User doesnot exist", 400));

    await userModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
});

//change user's role
export const changeRole = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) return next(new ErrorHandler("User doesnot exists", 400));


    if (user.role === 'admin') user.role = 'user';
    else if (user.role === 'user') user.role = 'admin';
    
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Role changed successfully'
    })

})