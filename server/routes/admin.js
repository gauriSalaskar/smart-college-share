const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllListings, updateListingStatus, getAllUsers, toggleUserStatus, getStats } = require('../controllers/adminController');

router.use(protect, adminOnly);
router.get('/listings', getAllListings);
router.patch('/listings/:id/status', updateListingStatus);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.get('/stats', getStats);

module.exports = router;
