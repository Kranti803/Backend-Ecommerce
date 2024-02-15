import express from 'express';
const router = express.Router();
import { isAdmin } from './../middlewares/isAdmin.js';
import { isLoggedIn } from './../middlewares/isLoggedIn.js';
import { signleUpload } from './../middlewares/multer.js';
import { addProducts, addReviewAndRating, deleteProduct, deleteReviewAndRating, getAProduct, getAllProducts, updateProduct } from './../controllers/productController.js';

//get all products
router.route('/get_all_products').get(getAllProducts);

//get a single product
router.route('/product/:id').get(getAProduct);

//add products
router.route('/admin/addproducts').post(isLoggedIn, isAdmin, signleUpload, addProducts);

//update a product
router.route('/admin/updateproduct/:id').put(isLoggedIn, isAdmin, signleUpload, updateProduct);

//delete a product
router.route('/admin/deleteproduct/:id').delete(isLoggedIn, isAdmin, deleteProduct);

//add review and rating
router.route('/product_details/addreview_and_rating/:productId').post(isLoggedIn, addReviewAndRating);

//delete review and rating
router.route('/product_details/deletereview_and_rating/:productId').delete(isLoggedIn, deleteReviewAndRating);

export default router;