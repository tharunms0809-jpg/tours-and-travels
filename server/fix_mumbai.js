const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  const db = mongoose.connection.collection('packages');
  
  const mumbaiUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(
    'Gateway of India Mumbai Maharashtra skyline, iconic arch monument at waterfront, Queen Victoria gothic buildings, Marine Drive queen necklace night lights, Elephanta caves ferry, bustling megacity, ultra-realistic travel photography, cinematic lighting, vibrant colors, 4K HDR, professional tourism advertisement, no text, no watermarks'
  ) + '?width=1260&height=750&nologo=true';

  const r = await db.updateMany(
    { title: 'Mumbai City Explorer' },
    { $set: { images: [mumbaiUrl] } }
  );
  console.log('Mumbai City Explorer - Matched:', r.matchedCount, '| Modified:', r.modifiedCount);
  await mongoose.disconnect();
  console.log('Done!');
});
