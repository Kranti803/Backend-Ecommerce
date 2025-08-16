import mongoose from "mongoose";

export const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI).then((data) => {
    console.log(`Connected to with server :${data.connection.host}`);
  })
}