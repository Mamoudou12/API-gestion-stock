// validators/inventoryValidator.js

import { body, validationResult } from 'express-validator';

// Règles de validation pour l'inventaire
export const inventoryValidationRules = [
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer.'),
  body('remarks').optional().isString().withMessage('Remarks must be a string.'),
  body('productId').isInt().withMessage('Product ID must be an integer.'),
  body('userId').optional().isInt().withMessage('User ID must be an integer.')
];

// Middleware de gestion des erreurs de validation
export const validateInventory = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
