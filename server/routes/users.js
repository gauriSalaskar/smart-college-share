const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { toggleBookmark, getBookmarks } = require('../controllers/userController');

router.use(protect);
router.post('/bookmark/:listingId', toggleBookmark);
router.get('/bookmarks', getBookmarks);

module.exports = router;
