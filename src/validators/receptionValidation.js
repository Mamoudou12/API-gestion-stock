// receptionValidation.js
import { body, validationResult } from 'express-validator';

// Règles de validation pour la réception
export const receptionValidationRules = [
  body('supplierId')
    .isInt().withMessage('Supplier ID must be an integer.'),
  
  body('userId')
    .isInt().withMessage('User ID must be an integer.'),
  
  body('detailReceptions')
    .isArray({ min: 1 }).withMessage('Detail receptions must include at least one detail.')
    .custom(details => {
      details.forEach(detail => {
        if (!detail.productId || !detail.quantity) {
          throw new Error('Each detail reception must include productId and quantity.');
        }
        if (typeof detail.quantity !== 'number' || detail.quantity <= 0) {
          throw new Error('Quantity must be a positive number.');
        }
      });
      return true;
    }),
];

// Middleware pour gérer les erreurs de validation
export const validateReception = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
