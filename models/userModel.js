import mongoose from "mongoose";
import { Schema } from "mongoose";
import validator from 'validator'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: validator.isEmail,
        unique: true
    },
    password: {
        type: Number,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be grater than 7 characters"],
        maxLength: [20, "Password cannot be greater than 20 characters"],
        select: false,
    },
    role: {
        type: String,
        eum: ['admin', 'user'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: String

}, { timestamps: true })
export const userModel = new mongoose.model('User', userSchema); 