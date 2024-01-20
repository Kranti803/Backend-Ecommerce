import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { v2 as cloudinary } from 'cloudinary';
import { productModel } from "../models/productModel.js";
import { ErrorHandler } from './../utils/ErrorHandler.js';
import { getDataUri } from "../utils/getDataUri.js";

//add products
export const addProducts = catchAsyncError(async (req, res, next) => {
    const { title, description, price, stock, category } = req.body;

    if (!title || !description || !price || !stock || !category) return next(new ErrorHandler("All fields are required", 400));


    const file = req.file;
    if (!file) return next(new ErrorHandler("Please provide the product image", 400));

    const fileUri = getDataUri(file);
    //uploading the file on cloudinary
    const uploadedFile = await cloudinary.uploader.upload(fileUri.content);

    const productImage = {
        public_id: uploadedFile.public_id,
        url: uploadedFile.url
    }

    const newProduct = await productModel.create({ title, description, price, stock, category, productImage });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        newProduct
    });

});

//update a product
export const updateProduct = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const file = req.file;

    if (id.length < 24) return next(new ErrorHandler("Product doesnot exits", 400));

    let product = await productModel.findById(id);

    if (!product) return next(new ErrorHandler("Product doesnot exits", 404));

    await productModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (file) {

        await cloudinary.uploader.destroy(product.productImage.public_id);
        const fileUri = getDataUri(file);
        const uploadedFile = await cloudinary.uploader.upload(fileUri.content);
        product.productImage = {
            public_id: uploadedFile.public_id,
            url: uploadedFile.url
        }
        await product.save();
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully"
    })

})

//delete a product
export const deleteProduct = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;

    if (id.length < 24) return next(new ErrorHandler("Product doesnot exits", 400));

    let product = await productModel.findById(id);

    if (!product) return next(new ErrorHandler("Product doesnot exits", 400));

    await cloudinary.uploader.destroy(product.productImage.public_id);

    await productModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })

})
