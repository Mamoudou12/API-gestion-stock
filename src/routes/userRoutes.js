// src/routes/userRoutes.js
import express from 'express';
import UserController from '../controllers/userController.js';
import { userValidationRules, validateUser } from '../validators/userValidation.js';

const router = express.Router();

// Define routes
router.post('/users', userValidationRules, validateUser, UserController.createUser);
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', userValidationRules, validateUser, UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;
