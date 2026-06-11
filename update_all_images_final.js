const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';

// 55 unique, real Pexels CDN image URLs - each representing its destination
const packageImageMap = {
  // ── KARNATAKA ──
  'Bheemeshwari Adventure Package':
    'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Horanadu & Sringeri Spiritual Tour':
    'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Kodachadri Trek Package':
    'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Kemmanagundi Hill Station Tour':
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Biligiri Rangan Hills Wildlife Tour':
    'https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'KRS Dam & Brindavan Gardens Package':
    'https://images.pexels.com/photos/13951531/pexels-photo-13951531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── LADAKH ──
  'Pangong Lake Adventure':
    'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Leh Ladakh Bike Expedition':
    'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── NORTHEAST INDIA ──
  'Kaziranga Wildlife Safari':
    'https://images.pexels.com/photos/4503739/pexels-photo-4503739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Shillong & Cherrapunji Tour':
    'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'North Sikkim Adventure':
    'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── GUJARAT ──
  'Rann of Kutch Festival Package':
    'https://images.pexels.com/photos/6739212/pexels-photo-6739212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Statue of Unity Tour':
    'https://images.pexels.com/photos/11706993/pexels-photo-11706993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── ODISHA ──
  'Konark Heritage Package':
    'https://images.pexels.com/photos/13840308/pexels-photo-13840308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Sundarbans Wildlife Package':
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Puri Jagannath Tour':
    'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── WEST BENGAL ──
  'Darjeeling Tea Estate Tour':
    'https://images.pexels.com/photos/2331592/pexels-photo-2331592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── MADHYA PRADESH ──
  'Khajuraho Heritage Tour':
    'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Bandhavgarh Wildlife Safari':
    'https://images.pexels.com/photos/162140/tiger-animal-wild-nature-162140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── JAMMU & KASHMIR ──
  'Gulmarg Snow Adventure':
    'https://images.pexels.com/photos/3822215/pexels-photo-3822215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Srinagar Paradise Tour':
    'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Kashmir Honeymoon Package':
    'https://images.pexels.com/photos/3581385/pexels-photo-3581385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── UTTARAKHAND ──
  'Char Dham Yatra':
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Mussoorie Hills Package':
    'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Nainital Lake Tour':
    'https://images.pexels.com/photos/13665852/pexels-photo-13665852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Varanasi Spiritual Journey':
    'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── HIMACHAL PRADESH ──
  'Spiti Valley Expedition':
    'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Manali Adventure Tour':
    'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Shimla Family Vacation':
    'https://images.pexels.com/photos/5007979/pexels-photo-5007979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── PUNJAB ──
  'Amritsar Golden Temple Tour':
    'https://images.pexels.com/photos/3580813/pexels-photo-3580813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── UTTAR PRADESH ──
  'Agra Taj Mahal Tour':
    'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── RAJASTHAN ──
  'Jaipur Royal Heritage Tour':
    'https://images.pexels.com/photos/3581376/pexels-photo-3581376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Jaisalmer Desert Safari':
    'https://images.pexels.com/photos/4906280/pexels-photo-4906280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Udaipur Lake City Package':
    'https://images.pexels.com/photos/3526022/pexels-photo-3526022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Rajasthan Luxury Tour':
    'https://images.pexels.com/photos/9480893/pexels-photo-9480893.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── MAHARASHTRA ──
  'Ajanta Ellora Heritage Tour':
    'https://images.pexels.com/photos/13362839/pexels-photo-13362839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Mumbai City Explore':
    'https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Lonavala Weekend Tour':
    'https://images.pexels.com/photos/5245525/pexels-photo-5245525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Mahabaleshwar Retreat':
    'https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── TELANGANA ──
  'Hyderabad Heritage Tour':
    'https://images.pexels.com/photos/12810557/pexels-photo-12810557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Ramoji Film City Package':
    'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── ANDHRA PRADESH ──
  'Araku Valley Tour':
    'https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Tirupati Spiritual Package':
    'https://images.pexels.com/photos/3217911/pexels-photo-3217911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── TAMIL NADU ──
  'Ooty Hill Station Tour':
    'https://images.pexels.com/photos/2507025/pexels-photo-2507025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Kodaikanal Family Package':
    'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Madurai Temple Heritage Tour':
    'https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Rameshwaram Pilgrimage Tour':
    'https://images.pexels.com/photos/7009859/pexels-photo-7009859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── KERALA ──
  'Munnar Tea Garden Tour':
    'https://images.pexels.com/photos/1493088/pexels-photo-1493088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Kerala Backwater Luxury Tour':
    'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Wayanad Nature Escape':
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Alleppey Houseboat Experience':
    'https://images.pexels.com/photos/3546641/pexels-photo-3546641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

  // ── GOA ──
  'Goa Water Sports Package':
    'https://images.pexels.com/photos/1554979/pexels-photo-1554979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'South Goa Luxury Escape':
    'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'North Goa Beach Explorer':
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
};

async function updateImages() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected!\n');

  const Package = mongoose.connection.collection('packages');
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFound = [];

  for (const [title, imageUrl] of Object.entries(packageImageMap)) {
    const result = await Package.updateMany(
      { title: title },
      { $set: { images: [imageUrl] } }
    );
    if (result.matchedCount > 0) {
      console.log(`✅ ${title}`);
      updatedCount++;
    } else {
      console.log(`⚠️  Not in DB: ${title}`);
      notFoundCount++;
      notFound.push(title);
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`🎉 Updated: ${updatedCount} packages`);
  if (notFoundCount > 0) {
    console.log(`⚠️  Not found: ${notFoundCount} → ${notFound.join(', ')}`);
  }
  console.log(`─────────────────────────────────────────`);
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

updateImages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
