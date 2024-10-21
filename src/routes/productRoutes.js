import express from 'express';
import ProductController from "../controllers/productController.js";
import { productValidationRules, validateProduct } from '../validators/productValidator.js';

const router = express.Router();

// Define routes
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', productValidationRules, ProductController.createProduct);
router.put('/products/:id', productValidationRules, validateProduct, ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);
 
export default router;
