import express from 'express';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { validateSupplier, handleValidationErrors } from '../validators/supplierValidator.js';

const router = express.Router();

router.get('/suppliers', getAllSuppliers);
router.get('/suppliers/:id', getSupplierById);
router.post('/suppliers', validateSupplier, handleValidationErrors, createSupplier);
router.put('/suppliers/:id', validateSupplier, handleValidationErrors, updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

export default router;
