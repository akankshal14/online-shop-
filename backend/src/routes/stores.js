const router = require('express').Router();
const { getStores, submitRating, getOwnerDashboard } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validate');

router.get('/', authenticate, authorize('normal_user', 'admin'), getStores);
router.post('/:id/rating', authenticate, authorize('normal_user'), ratingValidation, submitRating);
router.get('/owner/dashboard', authenticate, authorize('store_owner'), getOwnerDashboard);

module.exports = router;
