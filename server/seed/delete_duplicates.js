const mongoose = require('mongoose');
const Package = require('../models/Package');

const MONGODB_URI = 'mongodb://localhost:27017/toursdb';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB. Finding duplicates...');
    
    // Find all packages
    const allPackages = await Package.find({});
    console.log(`Total packages found: ${allPackages.length}`);
    
    const titleMap = new Map();
    let deletedCount = 0;

    for (const pkg of allPackages) {
      if (titleMap.has(pkg.title)) {
        // We found a duplicate, let's delete it
        await Package.findByIdAndDelete(pkg._id);
        deletedCount++;
        console.log(`Deleted duplicate: ${pkg.title}`);
      } else {
        // First time seeing this title
        titleMap.set(pkg.title, true);
      }
    }

    console.log(`Finished deleting ${deletedCount} repeated packages.`);
    console.log(`Remaining unique packages: ${allPackages.length - deletedCount}`);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });
