import express from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale
} from '../controllers/saleController.js';
import { saleValidationRules, validateSale } from '../validators/saleValidator.js';

const router = express.Router();

// Define routes for sales
router.get('/sales', getAllSales);
router.get('/sales/:id', getSaleById);
router.post('/sales', saleValidationRules, validateSale, createSale);
router.put('/sales/:id', saleValidationRules, validateSale, updateSale);
router.delete('/sales/:id', deleteSale);

export default router;
