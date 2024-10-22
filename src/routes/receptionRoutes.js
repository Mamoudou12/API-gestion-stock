import express from 'express';
import { 
  getReceptions, 
  getReceptionById, 
  createReception, 
  updateReception, 
  deleteReception 
} from '../controllers/receptionController.js';
import { 
  receptionValidationRules, 
  validateReception 
} from '../validators/receptionValidation.js';

const router = express.Router();

router.get('/receptions', getReceptions);
router.get('/receptions/:id', getReceptionById);
router.post('/receptions', receptionValidationRules, validateReception, createReception);
router.put('/receptions/:id', receptionValidationRules, validateReception, updateReception);
router.delete('/receptions/:id', deleteReception);

export default router;
