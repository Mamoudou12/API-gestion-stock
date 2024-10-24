import express from 'express';
import { 
  createInventory, 
  getInventories, 
  getInventoryById, 
  updateInventory, 
  deleteInventory 
} from '../controllers/inventoryController.js';
import { inventoryValidationRules, validateInventory } from '../validators/inventoryValidator.js';

const router = express.Router();

// Définition des routes pour l'inventaire
router.get('/inventories', getInventories);
router.get('/inventories/:id', getInventoryById);
router.post('/inventories', inventoryValidationRules, validateInventory, createInventory);
router.put('/inventories/:id', inventoryValidationRules, validateInventory, updateInventory);
router.delete('/inventories/:id', deleteInventory);

export default router;



