import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { v2 as cloudinary } from 'cloudinary';
import { productModel } from "../models/productModel.js";
import { ErrorHandler } from './../utils/ErrorHandler.js';
import { getDataUri } from "../utils/getDataUri.js";

//get all products
export const getAllProducts = catchAsyncError(async (req, res, next) => {


    const search = req.query.search || '';
    const category = req.query.category || '';
    const brand = req.query.brand || '';
    const rating = req.query.rating || 0;
    const startPrice = req.query.startPrice;
    const endPrice = req.query.endPrice;

    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);


    const products = await productModel.find({
        title: {
            $regex: search,
            $options: 'i'
        },
        category: {
            $regex: category,
            $options: 'i'
        },
        brand: {
            $regex: brand,
            $options: 'i'
        },
        ...(startPrice) && { //conditionally adding object
            price: {
                $gte: startPrice,
            }
        },
        ...(endPrice) && { //conditionally adding object
            price: {
                $lte: endPrice,
            }
        },
        rating: {
            $gte: rating
        }
    }).limit(pageSize).skip((page - 1) * pageSize);



    res.status(200).json({
        success: true,
        products,
        productsLenght: products.length
    })


})

//get a singleProduct
export const getAProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) return next(new ErrorHandler('Product doesnot exist', 400));
    res.status(200).json({
        success: true,
        product
    })
})


//add products
export const addProducts = catchAsyncError(async (req, res, next) => {
    const { title, description, price, stock, category, brand } = req.body;

    if (!title || !description || !price || !brand || !stock || !category) return next(new ErrorHandler("All fields are required", 400));


    const file = req.file;
    if (!file) return next(new ErrorHandler("Please provide the product image", 400));

    const fileUri = getDataUri(file);
    //uploading the file on cloudinary
    const uploadedFile = await cloudinary.uploader.upload(fileUri.content);

    const productImage = {
        public_id: uploadedFile.public_id,
        url: uploadedFile.url
    }

    const newProduct = await productModel.create({ title, description, price, brand, stock, category, productImage });

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

//add reviews and rating
export const addReviewAndRating = catchAsyncError(async (req, res, next) => {

    const { review, rating } = req.body;

    if (!review || !rating) return next(new ErrorHandler("Both review and rating are required", 400))

    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) return next(new ErrorHandler("Product doesnot exists", 404));

    let existedReviewIndex = product.reviews.findIndex((review) => review.userId.toString() === req.user._id.toString()); //return index if true else returns -1 if false

    if (existedReviewIndex === -1) {
        product.reviews.push({ userId: req.user._id, name: req.user.name, review, userRating: rating });
    } else {
        product.reviews[existedReviewIndex].review = review;
        product.reviews[existedReviewIndex].userRating = rating;
    }

    //calculating the average rating of the product
    const totalRating = product.reviews.reduce((totalSum, eachReview) => totalSum + eachReview.userRating, 0)
    product.rating = totalRating / product.reviews.length;
    await product.save();

    if (existedReviewIndex === -1) {
        res.status(201).json({
            success: true,
            message: "Review added successfully",
        })
    } else {
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
        })
    }

})

//delete reviews and rating
export const deleteReviewAndRating = catchAsyncError(async (req, res, next) => {

    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) return next(new ErrorHandler("Product doesnot exits", 404));

    const reviews = product.reviews.filter((review) => review.userId.toString() !== req.user._id.toString());

    product.reviews = reviews;

    const totalRating = product.reviews.reduce((totalSum, eachReview) => totalSum + eachReview.userRating, 0)
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    })

})




