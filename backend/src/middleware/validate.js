const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character');

const nameRules = body('name')
  .isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 characters');

const emailRules = body('email')
  .isEmail().withMessage('Invalid email format').normalizeEmail();

const addressRules = body('address')
  .optional()
  .isLength({ max: 400 }).withMessage('Address max 400 characters');

const registerValidation = [nameRules, emailRules, passwordRules, addressRules, handleValidation];
const loginValidation = [emailRules, handleValidation];
const storeValidation = [nameRules, emailRules, addressRules, handleValidation];
const passwordUpdateValidation = [passwordRules, handleValidation];
const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  handleValidation
];

module.exports = {
  registerValidation,
  loginValidation,
  storeValidation,
  passwordUpdateValidation,
  ratingValidation
};
