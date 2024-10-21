// validations/userValidation.js
import { body, validationResult } from 'express-validator';

export const userValidationRules = [
  body('name').isString().notEmpty().withMessage('Le nom est requis.'),
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit avoir au moins 6 caractères.'),
  body('role').isString().notEmpty().withMessage('Le rôle est requis.'),
];

export const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
