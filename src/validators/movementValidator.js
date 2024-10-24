import { body, validationResult } from 'express-validator';

const validMovementTypes = ['in', 'out']; // Types autorisés : entrée ou sortie

export const stockMovementValidationRules = [
  body('type')
    .isString().withMessage('Type must be a string.')
    .isIn(validMovementTypes).withMessage(`Type must be one of: ${validMovementTypes.join(', ')}`)
    .notEmpty().withMessage('Type is required.'),

  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer.')
    .notEmpty().withMessage('Quantity is required.'),

  body('movementDate')
    .isISO8601().withMessage('Movement date must be a valid date (ISO8601 format).')
    .optional(), // Optionnel, sinon on peut utiliser une date par défaut côté backend

  body('entity')
    .isString().withMessage('Entity must be a string.')
    .notEmpty().withMessage('Entity is required.'),

  body('productId')
    .isInt().withMessage('ProductId must be an integer.')
    .notEmpty().withMessage('ProductId is required.'),

  body('userId')
    .isInt().withMessage('UserId must be an integer.')
    .optional(), // Le userId est facultatif
];

export const validateStockMovement = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
