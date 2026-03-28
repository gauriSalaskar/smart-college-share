const Listing = require('../models/Listing');
const path = require('path');

// GET /api/listings — public, paginated, filtered
exports.getListings = async (req, res) => {
  try {
    const { category, type, search, page = 1, limit = 12, sort = '-createdAt', status } = req.query;
    const query = { status: 'approved' };

    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (status) query.status = status; // for admin
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('owner', 'name email phone college avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      listings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/listings/:id
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email phone college avatar');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    listing.views += 1;
    await listing.save({ validateBeforeSave: false });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/listings
exports.createListing = async (req, res) => {
  try {
    const { title, description, category, type, price, priceUnit, condition, location, contactPreference, tags } = req.body;
    const images = req.files ? req.files.map(f => ({
      url: `/uploads/${f.filename}`,
      publicId: f.filename,
    })) : [];

    const listing = await Listing.create({
      title, description, category, type,
      price: type === 'Share' ? 0 : price,
      priceUnit, condition, location, contactPreference,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      images,
      owner: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    await listing.populate('owner', 'name email phone');
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/listings/:id
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing.' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(f => ({ url: `/uploads/${f.filename}`, publicId: f.filename }));
    }
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim());
    }
    // Re-submit for approval if student edits
    if (req.user.role !== 'admin') updates.status = 'pending';

    listing = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('owner', 'name email phone');
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await listing.deleteOne();
    res.json({ success: true, message: 'Listing deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/listings/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });

    const idx = listing.likes.indexOf(req.user._id);
    if (idx > -1) listing.likes.splice(idx, 1);
    else listing.likes.push(req.user._id);
    await listing.save({ validateBeforeSave: false });

    res.json({ success: true, likes: listing.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/listings/my — own listings
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
