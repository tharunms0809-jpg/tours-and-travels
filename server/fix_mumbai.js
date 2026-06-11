const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.collection('packages');
  const r = await db.updateMany(
    { title: 'Mumbai City Explorer' },
    { $set: { images: ['https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'] } }
  );
  console.log('Mumbai City Explorer — Matched:', r.matchedCount, '| Modified:', r.modifiedCount);
  await mongoose.disconnect();
  console.log('Done!');
});
