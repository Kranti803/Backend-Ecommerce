import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { v2 as cloudinary } from 'cloudinary';

connectDB();

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLIENT_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});

app.listen(process.env.PORT, () => {
    console.log(`server is running on PORT = ${process.env.PORT}`);
})
