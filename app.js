import express from 'express';
import { config } from 'dotenv';
import { CustomError } from './middlewares/CustomError.js';
config({
    path: './config/config.env'
})
export const app = express();






app.get('/', (req, res) => {

    res.send(`<h1>Site is working </h1> `);

})

//custom error handle
app.use(CustomError)
