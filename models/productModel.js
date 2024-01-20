import mongoose, { Mongoose } from 'mongoose';
import { Schema } from 'mongoose';
import validator from 'validator';

const productSchema = new Schema({

    title: {
        type: String,
        required: [true, "Please enter product title"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    productImage: {
        public_id: {
            type: String,
            required: [true, "Please provide product image public_id"],
        },
        url: {
            type: String,
            required: [true, "Please provide product image url"],
        },
    },
    reviews: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            name: {
                type: String,
            },
            review: {
                type: String,
            }
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, "Please enter the number of stocks"]
    },
    category: {
        type: String,
        required: [true, "Please Provide the Category"]
    }

}, { timestamps: true });

export const productModel = new mongoose.model('Product', productSchema);
