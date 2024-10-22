import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { productValidationRules, validateProduct } from '../validators/productValidator.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', productValidationRules, validateProduct, createProduct);
router.put('/products/:id', productValidationRules, validateProduct, updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
