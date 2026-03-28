const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');
const {
  getListings, getListing, createListing, updateListing,
  deleteListing, toggleLike, getMyListings,
} = require('../controllers/listingController');

router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, upload.array('images', 4), createListing);
router.put('/:id', protect, upload.array('images', 4), updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
