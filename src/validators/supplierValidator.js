import { body, validationResult } from 'express-validator';

// Validator pour un fournisseur
export const validateSupplier = [
  body('email')
    .isEmail()
    .withMessage('Email is required and must be valid.'),
  body('phone')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Phone is required and must contain at least 8 digits.'),
  body('address')
    .optional()
    .isString()
    .withMessage('Address must be a string.'),
  body('userId')
    .isInt()
    .withMessage('User ID must be an integer.'),
];

// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
