const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Package = require('./models/Package');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';

// Real, high-quality Unsplash image URLs for each package
// Using Unsplash source API with specific photo IDs for reliability
const imageMap = [
  // ── GOA ──────────────────────────────────────────────────────────────────
  {
    title: 'North Goa Beach Explorer',
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'South Goa Luxury Escape',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Goa Water Sports Package',
    images: ['https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=900&auto=format&fit=crop&q=80']
  },

  // ── KERALA ───────────────────────────────────────────────────────────────
  {
    title: 'Munnar Tea Garden Tour',
    images: ['https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Alleppey Houseboat Experience',
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Wayanad Nature Escape',
    images: ['https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kerala Backwater Luxury Tour',
    images: ['https://images.unsplash.com/photo-1617194784792-6b1d9e8b8e32?w=900&auto=format&fit=crop&q=80']
  },

  // ── TAMIL NADU ───────────────────────────────────────────────────────────
  {
    title: 'Ooty Hill Station Tour',
    images: ['https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kodaikanal Family Package',
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Rameshwaram Pilgrimage Tour',
    images: ['https://images.unsplash.com/photo-1626183569065-e3ce6de33ab0?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Madurai Temple Heritage Tour',
    images: ['https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=900&auto=format&fit=crop&q=80']
  },

  // ── ANDHRA PRADESH & TELANGANA ────────────────────────────────────────────
  {
    title: 'Araku Valley Tour',
    images: ['https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Tirupati Spiritual Package',
    images: ['https://images.unsplash.com/photo-1625566943014-a4b4fdce0282?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Hyderabad Heritage Tour',
    images: ['https://images.unsplash.com/photo-1544461772-722f2a7c0c2d?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Ramoji Film City Package',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=900&auto=format&fit=crop&q=80']
  },

  // ── MAHARASHTRA ──────────────────────────────────────────────────────────
  {
    title: 'Mahabaleshwar Retreat',
    images: ['https://images.unsplash.com/photo-1482192505345-5852b4b38570?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Lonavala Weekend Tour',
    images: ['https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Mumbai City Explorer',
    images: ['https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=900&auto=format&fit=crop&q=80']
  },
  // Alternate title used in some seed files
  {
    title: 'Mumbai City Explore',
    images: ['https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Ajanta Ellora Heritage Tour',
    images: ['https://images.unsplash.com/photo-1590136145231-42afc1fa2caa?w=900&auto=format&fit=crop&q=80']
  },

  // ── RAJASTHAN ────────────────────────────────────────────────────────────
  {
    title: 'Jaipur Royal Heritage Tour',
    images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Udaipur Lake City Package',
    images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Jaisalmer Desert Safari',
    images: ['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Rajasthan Luxury Tour',
    images: ['https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=80']
  },

  // ── HIMACHAL PRADESH ─────────────────────────────────────────────────────
  {
    title: 'Manali Adventure Tour',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Shimla Family Vacation',
    images: ['https://images.unsplash.com/photo-1626873879437-eaa3e1cd900b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Spiti Valley Expedition',
    images: ['https://images.unsplash.com/photo-1623227489748-c3f3a6bf5034?w=900&auto=format&fit=crop&q=80']
  },

  // ── UTTARAKHAND ──────────────────────────────────────────────────────────
  {
    title: 'Nainital Lake Tour',
    images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Mussoorie Hills Package',
    images: ['https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Char Dham Yatra',
    images: ['https://images.unsplash.com/photo-1609766857898-4c0da7571b76?w=900&auto=format&fit=crop&q=80']
  },

  // ── JAMMU & KASHMIR ──────────────────────────────────────────────────────
  {
    title: 'Srinagar Paradise Tour',
    images: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Gulmarg Snow Adventure',
    images: ['https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kashmir Honeymoon Package',
    images: ['https://images.unsplash.com/photo-1598467721050-e8a82b91c5b5?w=900&auto=format&fit=crop&q=80']
  },

  // ── PUNJAB, UTTAR PRADESH, MADHYA PRADESH ────────────────────────────────
  {
    title: 'Amritsar Golden Temple Tour',
    images: ['https://images.unsplash.com/photo-1609766418204-5b7e3b91b7c2?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Agra Taj Mahal Tour',
    images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Varanasi Spiritual Journey',
    images: ['https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Khajuraho Heritage Tour',
    images: ['https://images.unsplash.com/photo-1565438559033-1b7c98578b6b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Bandhavgarh Wildlife Safari',
    images: ['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=900&auto=format&fit=crop&q=80']
  },

  // ── GUJARAT, WEST BENGAL, ODISHA ─────────────────────────────────────────
  {
    title: 'Statue of Unity Tour',
    images: ['https://images.unsplash.com/photo-1597074866923-dc0589150358?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Rann of Kutch Festival Package',
    images: ['https://images.unsplash.com/photo-1573492010-1f1addf76f6a?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Darjeeling Tea Estate Tour',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Sundarbans Wildlife Package',
    images: ['https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Puri Jagannath Tour',
    images: ['https://images.unsplash.com/photo-1609501676374-37792b7d4c2a?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Konark Heritage Package',
    images: ['https://images.unsplash.com/photo-1598553596701-4e39dde3aeaa?w=900&auto=format&fit=crop&q=80']
  },

  // ── SIKKIM, ASSAM, MEGHALAYA, LADAKH ────────────────────────────────────
  {
    title: 'North Sikkim Adventure',
    images: ['https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kaziranga Wildlife Safari',
    images: ['https://images.unsplash.com/photo-1602526430780-782d6b1783fa?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Shillong & Cherrapunji Tour',
    images: ['https://images.unsplash.com/photo-1605538883606-a7ee025a88f2?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Leh Ladakh Bike Expedition',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Pangong Lake Adventure',
    images: ['https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Andaman Island Paradise Package',
    images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Gangtok Himalayan Tour',
    images: ['https://images.unsplash.com/photo-1568838573817-71e1c76b1fd8?w=900&auto=format&fit=crop&q=80']
  },

  // ── KARNATAKA ────────────────────────────────────────────────────────────
  {
    title: 'Bheemeshwari Adventure Package',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Horanadu & Sringeri Spiritual Tour',
    images: ['https://images.unsplash.com/photo-1622308644420-b20142dc993c?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kodachadri Trek Package',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kemmanagundi Hill Station Tour',
    images: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Biligiri Rangan Hills Wildlife Tour',
    images: ['https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'KRS Dam & Brindavan Gardens Package',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kudremukh Trek & Nature Package',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Jog Falls & Murudeshwar Package',
    images: ['https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Belur Halebidu Heritage Tour',
    images: ['https://images.unsplash.com/photo-1582458538509-d9fbd1e00c5b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Badami Pattadakal Aihole Package',
    images: ['https://images.unsplash.com/photo-1605649461784-edc78f9d0a93?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kabini Wildlife Safari Package',
    images: ['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Bandipur Nature Package',
    images: ['https://images.unsplash.com/photo-1585071550721-fdb85a67f401?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Sakleshpur Green Escape',
    images: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Udupi & Maravanthe Beach Package',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Agumbe Rainforest Package',
    images: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Premium Karnataka Grand Tour',
    images: ['https://images.unsplash.com/photo-1580824456624-e13ce5e5ecb0?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Karwar Beach Package',
    images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Shivagange Adventure Tour',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Yana Caves & Gokarna Package',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Dharmasthala & Kukke Subramanya Package',
    images: ['https://images.unsplash.com/photo-1626200419003-5c3e3a9c9b0f?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Nagarhole Wildlife Safari Package',
    images: ['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Chitradurga Fort Heritage Tour',
    images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Savanadurga Trek Package',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Talakaveri & Madikeri Package',
    images: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Udupi Temple & Beach Tour',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80']
  },
  {
    title: 'Kudle Beach & Paradise Beach Package',
    images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&auto=format&fit=crop&q=80']
  },
];

// Build a map for quick lookup
const titleToImages = {};
for (const entry of imageMap) {
  titleToImages[entry.title.trim()] = entry.images;
}

async function updateImages() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB');

  const allPackages = await Package.find({});
  console.log(`📦 Found ${allPackages.length} packages in DB`);

  let updated = 0;
  let skipped = 0;
  const skippedTitles = [];

  for (const pkg of allPackages) {
    const title = pkg.title.trim();
    const newImages = titleToImages[title];

    if (newImages) {
      await Package.findByIdAndUpdate(pkg._id, { $set: { images: newImages } });
      console.log(`  ✅ Updated: "${title}"`);
      updated++;
    } else {
      console.log(`  ⚠️  No mapping found for: "${title}"`);
      skippedTitles.push(title);
      skipped++;
    }
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log(`🎉 Done! Updated: ${updated}  |  Skipped: ${skipped}`);
  if (skippedTitles.length) {
    console.log('\n⚠️  Packages with no image mapping (kept original):');
    skippedTitles.forEach(t => console.log(`   - ${t}`));
  }

  await mongoose.disconnect();
}

updateImages().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
