import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { productModel } from "../models/productModel.js";
import { statModel } from "../models/statsModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { orderModel } from './../models/orderModel.js';
import { userModel } from './../models/userModel.js';

//contact us
export const contactUs = catchAsyncError(async (req, res) => {

    const { name, email, phone, message } = req.body;

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
        const month = orderDate.getMonth() + 1; // JavaScript months are 0-indexed
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

    const monthlyStatsArray = Object.values(monthlyStats).sort((a, b) => {
        // Sorting by year and then by month
        return a.year - b.year || a.month - b.month;
    });

    res.status(200).json({
        success: true,
        totalOrder,
        totalUser,
        totalProduct,
        totalRevenue: totalPrice,
        monthlyStats: monthlyStatsArray
    });


})