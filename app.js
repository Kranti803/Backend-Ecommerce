import express from 'express';
import { config } from 'dotenv';
import { CustomError } from './middlewares/CustomError.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config({
    path: './config/config.env'
})
export const app = express();

//to parse the cookie from req.cookie
app.use(cookieParser());

//cors
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000',
    methods:['GET','POST','PUT','DELETE']
}))

//to parse req.body to json
app.use(express.json());

//importing and using routes
import userRoute from './routes/userRoute.js';
app.use('/api/v1', userRoute);





app.get('/', (req, res) => {

    res.send(`<h1>Site is working </h1> `);

})

//custom error handler
app.use(CustomError);
