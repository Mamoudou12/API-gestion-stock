import express from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { userValidationRules, validateUser } from '../validators/userValidation.js';

const router = express.Router();

// Définition des routes utilisateur
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', userValidationRules, validateUser, createUser);
router.put('/users/:id', userValidationRules, validateUser, updateUser);
router.delete('/users/:id', deleteUser);

export default router;
