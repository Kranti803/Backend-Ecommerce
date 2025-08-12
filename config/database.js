import mongoose from "mongoose";
mongoose.set('strictQuery', true);

export const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI).then((data) => {
    console.log(`Connected to with server :${data.connection.host}`);
  })
}
