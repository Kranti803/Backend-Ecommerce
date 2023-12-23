import mongoose from "mongoose";
mongoose.set('strictQuery', true);


export const connectDB = () => {

    mongoose.connect(process.env.MONGODB_URI).then(data => console.log(`DB is connected to : ${data.connection.host}`)).catch((error) => console.log(error))

}