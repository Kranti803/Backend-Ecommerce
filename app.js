import express from 'express';
import { CustomError } from './middlewares/CustomError.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//to setup env variables
import { config } from 'dotenv';
config({
    path: './config/config.env'
})
export const app = express();

//to parse the cookie from req.cookie
app.use(cookieParser());


//cors
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

//to parse req.body to json
app.use(express.json());

//importing and using routes
import userRoute from './routes/userRoute.js';
import otherRoute from './routes/otherRoute.js'
import productRoute from './routes/productRoute.js'
import orderRoute from './routes/orderRoute.js'

app.use('/api/v1', userRoute);
app.use('/api/v1', otherRoute);
app.use('/api/v1', productRoute);
app.use('/api/v1', orderRoute);





app.get('/', (req, res) => {

    res.send(`<h1>Site is working </h1> `);

})

//custom error handler
app.use(CustomError);
