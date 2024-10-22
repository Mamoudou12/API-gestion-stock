import { body, validationResult } from 'express-validator';

export const saleValidationRules = [
  body('totalAmount')
    .isFloat({ min: 0 }).withMessage('Total amount must be a positive number.')
    .custom(value => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error('Total amount must have at most two decimal places.');
      }
      return true;
    }),

  body('firstName')
    .optional() // Optional field
    .isString().withMessage('First name must be a string.')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.'),

  body('lastName')
    .optional() // Optional field
    .isString().withMessage('Last name must be a string.')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.'),

  body('address')
    .optional()
    .isString().withMessage('Address must be a string.')
    .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters.'),

  body('userId')
    .optional() // Nullable field
    .isInt().withMessage('userId must be an integer.'),

  body('saleDetails')
    .isArray({ min: 1 }).withMessage('Sale must include at least one sale detail.')
    .custom(details => {
      details.forEach(detail => {
        if (!detail.productId || !detail.quantity) {
          throw new Error('Each sale detail must include productId and quantity.');
        }
        if (typeof detail.quantity !== 'number' || detail.quantity <= 0) {
          throw new Error('Quantity must be a positive number.');
        }
      });
      return true;
    }),
];

// Middleware pour gérer les erreurs de validation
export const validateSale = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
