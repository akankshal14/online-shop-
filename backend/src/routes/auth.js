const router = require('express').Router();
const { register, login, updatePassword, me } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const handleVal = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

const pwdValidation = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/).withMessage('Must contain one uppercase letter')
    .matches(/[^A-Za-z0-9]/).withMessage('Must contain one special character'),
  handleVal
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, me);
router.put('/password', authenticate, pwdValidation, updatePassword);

module.exports = router;
