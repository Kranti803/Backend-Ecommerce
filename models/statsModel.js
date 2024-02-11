import mongoose from "mongoose";
import { Schema } from "mongoose";

const statSchema = new Schema({
    revenue: {
        type: Number,
        default: 0
    },
    orders: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const statModel = new mongoose.model('Stat', statSchema);