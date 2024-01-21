import express from 'express';
const router = express.Router();
import { isAdmin } from './../middlewares/isAdmin.js';
import { isLoggedIn } from './../middlewares/isLoggedIn.js';
import { signleUpload } from './../middlewares/multer.js';
import { addProducts, deleteProduct, getAllProducts, updateProduct } from './../controllers/productController.js';

//get all products
router.route('/get_all_products').get(getAllProducts);

//add products
router.route('/admin/addproducts').post(isLoggedIn, isAdmin, signleUpload, addProducts);

//update a product
router.route('/admin/updateproduct/:id').put(isLoggedIn, isAdmin, signleUpload, updateProduct);

//delete a product
router.route('/admin/deleteproduct/:id').delete(isLoggedIn, isAdmin, deleteProduct);


export default router;