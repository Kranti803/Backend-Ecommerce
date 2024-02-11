import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { v2 as cloudinary } from 'cloudinary';
import cron from "node-cron";
import { statModel } from "./models/statsModel.js";

connectDB();

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLIENT_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});

//getting stats for dashboard every month
cron.schedule("0 0 0 1 * * ", async () => {
    await statModel.create({});
});


app.listen(process.env.PORT, () => {
    console.log(`server is running on PORT = ${process.env.PORT}`);
})
