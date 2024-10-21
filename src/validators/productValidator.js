import { body, validationResult } from 'express-validator';

const validCategories = ['Fruits and vegetables', 'Dairy products', 'Meat', 'Beverages', 'Grocery'];

export const productValidationRules = [
  body('name')
    .isString().withMessage('Name must be a string.')
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters.')
    .notEmpty().withMessage('Name is required.'),
    
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number.')
    .custom(value => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error('Price must have at most two decimal places.');
      }
      return true;
    }),

  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer.')
    .custom(value => {
      if (value > 1000) {
        throw new Error('Stock cannot exceed 1000 units.');
      }
      return true;
    }),

  body('category')
    .isString().withMessage('Category must be a string.')
    .isIn(validCategories).withMessage(`Category must be one of the following: ${validCategories.join(', ')}`),

  body('safetyStock')
    .isInt({ min: 0 }).withMessage('Safety stock must be a positive integer.')
    .custom((value, { req }) => {
      if (value > req.body.stock) {
        throw new Error('Safety stock cannot exceed stock.');
      }
      return true;
    }),

  body('userId')
    .isInt().withMessage('userId must be an integer.'),
];

export const validateProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
