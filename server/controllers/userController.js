const User = require('../models/User');
const Listing = require('../models/Listing');

// POST /api/users/bookmark/:listingId
exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const listingId = req.params.listingId;
    const idx = user.bookmarks.indexOf(listingId);
    if (idx > -1) user.bookmarks.splice(idx, 1);
    else user.bookmarks.push(listingId);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, bookmarks: user.bookmarks, bookmarked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      populate: { path: 'owner', select: 'name email' },
    });
    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
