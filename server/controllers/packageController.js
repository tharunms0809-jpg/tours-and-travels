const Package = require('../models/Package');

// @desc    Get all packages with search, filter, sort, pagination
// @route   GET /api/packages
exports.getAllPackages = async (req, res) => {
  try {
    const {
      search, destination, state, category, minPrice, maxPrice,
      minDuration, maxDuration, sort, page = 1, limit = 12,
      featured
    } = req.query;

    let query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minDuration || maxDuration) {
      query['duration.days'] = {};
      if (minDuration) query['duration.days'].$gte = Number(minDuration);
      if (maxDuration) query['duration.days'].$lte = Number(maxDuration);
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'duration') sortOption = { 'duration.days': 1 };

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      data: packages,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new package (admin only)
// @route   POST /api/packages
exports.createPackage = async (req, res) => {
  try {
    // Handle uploaded image files
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    // Handle URL-based images
    else if (req.body.imageUrls) {
      try {
        req.body.images = JSON.parse(req.body.imageUrls);
      } catch (e) {
        req.body.images = [req.body.imageUrls];
      }
      delete req.body.imageUrls;
    }

    // Parse JSON fields if sent as strings
    if (typeof req.body.duration === 'string') req.body.duration = JSON.parse(req.body.duration);
    if (typeof req.body.hotel === 'string') req.body.hotel = JSON.parse(req.body.hotel);
    if (typeof req.body.transport === 'string') req.body.transport = JSON.parse(req.body.transport);
    if (typeof req.body.groupSize === 'string') req.body.groupSize = JSON.parse(req.body.groupSize);
    if (typeof req.body.highlights === 'string') req.body.highlights = JSON.parse(req.body.highlights);
    if (typeof req.body.itinerary === 'string') req.body.itinerary = JSON.parse(req.body.itinerary);
    if (typeof req.body.inclusions === 'string') req.body.inclusions = JSON.parse(req.body.inclusions);
    if (typeof req.body.exclusions === 'string') req.body.exclusions = JSON.parse(req.body.exclusions);

    const pkg = await Package.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: pkg
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a package (admin only)
// @route   PUT /api/packages/:id
exports.updatePackage = async (req, res) => {
  try {
    // Handle uploaded image files
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    // Handle URL-based images passed as JSON string
    else if (req.body.imageUrls) {
      try {
        req.body.images = JSON.parse(req.body.imageUrls);
      } catch (e) {
        req.body.images = [req.body.imageUrls];
      }
      delete req.body.imageUrls;
    }

    if (typeof req.body.duration === 'string') req.body.duration = JSON.parse(req.body.duration);
    if (typeof req.body.hotel === 'string') req.body.hotel = JSON.parse(req.body.hotel);
    if (typeof req.body.transport === 'string') req.body.transport = JSON.parse(req.body.transport);
    if (typeof req.body.groupSize === 'string') req.body.groupSize = JSON.parse(req.body.groupSize);
    if (typeof req.body.highlights === 'string') req.body.highlights = JSON.parse(req.body.highlights);
    if (typeof req.body.inclusions === 'string') req.body.inclusions = JSON.parse(req.body.inclusions);
    if (typeof req.body.exclusions === 'string') req.body.exclusions = JSON.parse(req.body.exclusions);
    if (typeof req.body.itinerary === 'string') req.body.itinerary = JSON.parse(req.body.itinerary);

    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: pkg
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a package (admin only)
// @route   DELETE /api/packages/:id
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all unique destinations
// @route   GET /api/packages/destinations/list
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Package.distinct('destination');
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
