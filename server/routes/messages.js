const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { sendMessage, getInbox, getSent, markRead } = require('../controllers/messageController');

router.use(protect);
router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/sent', getSent);
router.patch('/:id/read', markRead);

module.exports = router;
