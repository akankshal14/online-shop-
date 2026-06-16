const router = require('express').Router();
const { getDashboard, getUsers, getUserById, createUser, getStores, createStore } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { registerValidation, storeValidation } = require('../middleware/validate');
const { body, validationResult } = require('express-validator');

const isAdmin = [authenticate, authorize('admin')];

const handleVal = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

const createUserValidation = [
  ...registerValidation.slice(0, -1),
  body('role').isIn(['admin', 'normal_user', 'store_owner']).withMessage('Invalid role'),
  handleVal
];

router.get('/dashboard', ...isAdmin, getDashboard);
router.get('/users', ...isAdmin, getUsers);
router.get('/users/:id', ...isAdmin, getUserById);
router.post('/users', ...isAdmin, createUserValidation, createUser);
router.get('/stores', ...isAdmin, getStores);
router.post('/stores', ...isAdmin, storeValidation, createStore);

module.exports = router;
