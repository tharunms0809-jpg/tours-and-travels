const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/toursdb';

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema, 'packages');

async function removeDuplicates() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // Get all packages
  const all = await Package.find({}).lean();
  console.log(`📦 Total packages found: ${all.length}`);

  // Group by title
  const seen = {};
  const toDelete = [];

  for (const pkg of all) {
    const title = pkg.title || pkg.name || String(pkg._id);
    if (seen[title]) {
      toDelete.push(pkg._id);
    } else {
      seen[title] = pkg._id;
    }
  }

  console.log(`🔍 Unique packages: ${Object.keys(seen).length}`);
  console.log(`🗑️  Duplicates to delete: ${toDelete.length}\n`);

  if (toDelete.length === 0) {
    console.log('✅ No duplicates found!');
    await mongoose.disconnect();
    return;
  }

  // Delete duplicates
  const result = await Package.deleteMany({ _id: { $in: toDelete } });
  console.log(`✅ Deleted ${result.deletedCount} duplicate packages.`);

  // Verify
  const remaining = await Package.countDocuments();
  console.log(`\n📦 Packages remaining in DB: ${remaining}`);

  await mongoose.disconnect();
  console.log('\n🎉 Done! All duplicates removed.');
}

removeDuplicates().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
