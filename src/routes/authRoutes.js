import express from 'express';
import AuthController from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import validateRequest from '../middlewars/validateRequest.js';

const router = express.Router();

// Route d'inscription
router.post('/register', registerValidation, validateRequest, AuthController.register);

// Route de connexion
router.post('/login', loginValidation, validateRequest, AuthController.login);

export default router;
