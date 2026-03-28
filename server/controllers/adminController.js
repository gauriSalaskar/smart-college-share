const Listing = require('../models/Listing');
const User = require('../models/User');

// GET /api/admin/listings
exports.getAllListings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('owner', 'name email college')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ success: true, listings, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/listings/:id/status
exports.updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt').select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalListings, pendingListings, approvedListings] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'pending' }),
      Listing.countDocuments({ status: 'approved' }),
    ]);
    const categoryStats = await Listing.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    res.json({ success: true, stats: { totalUsers, totalListings, pendingListings, approvedListings, categoryStats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
