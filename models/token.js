import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600 //1hr
    }
})

export const tokenModel = new mongoose.model('Token', tokenSchema);