import { body } from 'express-validator';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
  body('role')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either "admin" or "user".'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];
