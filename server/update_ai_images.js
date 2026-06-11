const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';

// Hyper-specific AI-generated image prompts for each package
// URL format: https://image.pollinations.ai/prompt/{encoded}?width=1260&height=750&nologo=true
const pkg = (prompt) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt + ', ultra-realistic travel photography, cinematic lighting, vibrant colors, 4K HDR, professional tourism advertisement, no text, no watermarks'
  )}?width=1260&height=750&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;

const packageImageMap = {
  // ── KARNATAKA ──
  'Bheemeshwari Adventure Package':
    pkg('Bheemeshwari river adventure Karnataka India, people white water river rafting in emerald green Cauvery river, dense forest on both sides, mist rising from water, adrenaline rush'),
  'Horanadu & Sringeri Spiritual Tour':
    pkg('Horanadu Annapoorneshwari temple and Sringeri Sharadamba temple Karnataka India, ancient Hindu temple beside river, lush green jungle surroundings, pilgrims in traditional attire, golden divine light'),
  'Kodachadri Trek Package':
    pkg('Kodachadri peak trek Western Ghats Karnataka India, misty mountain summit trekkers, vast green valley panoramic view, sunrise over mist-covered forest, adventurous mountain trail'),
  'Kemmanagundi Hill Station Tour':
    pkg('Kemmanagundi Z point viewpoint Karnataka hills India, lush green rolling hills waterfall valley, flower garden on hillside, morning mist over valleys, breathtaking panoramic landscape'),
  'Biligiri Rangan Hills Wildlife Tour':
    pkg('Biligiri Rangana Betta wildlife sanctuary Karnataka India, wild elephants walking through thick forest, tribal village surroundings, dense jungle canopy, wildlife safari jeep'),
  'KRS Dam & Brindavan Gardens Package':
    pkg('KRS Krishnaraja Sagar dam Brindavan gardens Mysore Karnataka India, beautiful illuminated musical fountain at night, Mughal-style garden terraces, colorful lights reflecting on water, tourists enjoying evening'),

  // ── LADAKH ──
  'Pangong Lake Adventure':
    pkg('Pangong Tso Lake Ladakh India, surreal azure blue high altitude lake, snow-capped Himalayan mountains reflection, crystal clear sky, camping tents on lakeside, breathtaking isolated landscape'),
  'Leh Ladakh Bike Expedition':
    pkg('Royal Enfield motorcycles riding through Ladakh mountain roads India, dramatic high altitude desert landscape, Khardung La pass, riders in riding gear, barren mountain pass, vast blue sky'),

  // ── NORTHEAST INDIA ──
  'Kaziranga Wildlife Safari':
    pkg('Indian one-horned rhinoceros in Kaziranga National Park Assam India, rhino in tall elephant grass, jeep safari close-up, UNESCO world heritage wildlife, misty morning in grassland'),
  'Shillong & Cherrapunji Tour':
    pkg('Nohkalikai Falls Cherrapunji Meghalaya India, tallest plunge waterfall in India, lush green valleys, mist and clouds, living root bridges Meghalaya, northeast India lush landscape'),
  'North Sikkim Adventure':
    pkg('North Sikkim Gurudongmar Lake India, pristine high altitude lake surrounded by snow mountains, remote Himalayan landscape, frozen lake, dramatic clouds, adventure expedition campsite'),
  'Rann of Kutch Festival Package':
    pkg('Rann Utsav white salt desert Kutch Gujarat India, vast white salt flat under full moon, colorful festival tents, traditional Gujarati folk dancers in embroidered costumes, camels at sunset'),

  // ── GUJARAT / ODISHA ──
  'Statue of Unity Tour':
    pkg('Statue of Unity Kevadia Gujarat India, world tallest statue of Sardar Vallabhbhai Patel, dramatic valley view, Narmada river below, tourists visiting, sunset sky behind statue'),
  'Konark Heritage Package':
    pkg('Konark Sun Temple Odisha India, ancient 13th century UNESCO heritage stone chariot temple, intricate sandstone carvings, golden sunrise light, archaeologists and tourists exploring'),
  'Sundarbans Wildlife Package':
    pkg('Sundarbans mangrove forest West Bengal India, dense mangrove delta, Royal Bengal tiger by water, boat safari through narrow mangrove channels, UNESCO world heritage, misty morning'),
  'Puri Jagannath Tour':
    pkg('Jagannath Temple Puri Odisha India, ancient Hindu temple tower rising above the city, devotees thronging the street, Rath Yatra chariot festival, vibrant religious atmosphere, ocean background'),

  // ── WEST BENGAL ──
  'Darjeeling Tea Estate Tour':
    pkg('Darjeeling tea estate West Bengal India, green rolling tea garden hills, women tea pickers in colorful saris plucking tea leaves, Kanchenjunga snow peak background, misty morning Himalayan foothills'),

  // ── MADHYA PRADESH ──
  'Khajuraho Heritage Tour':
    pkg('Khajuraho temples Madhya Pradesh India, UNESCO heritage medieval Hindu and Jain temples, intricate stone erotic sculptures, warm golden hour sunlight, ancient carved temple towers'),
  'Bandhavgarh Wildlife Safari':
    pkg('Royal Bengal tiger in Bandhavgarh National Park Madhya Pradesh India, majestic tiger walking through jungle, safari jeep in background, dense forest, golden morning light, wildlife photography'),

  // ── JAMMU & KASHMIR ──
  'Gulmarg Snow Adventure':
    pkg('Gulmarg ski resort snow adventure Jammu Kashmir India, skiers on pristine white snow slopes, Gulmarg Gondola cable car, pine forest snowscape, Himalayan mountain backdrop, winter sports paradise'),
  'Srinagar Paradise Tour':
    pkg('Dal Lake Srinagar Kashmir India, traditional shikara wooden boat on calm Dal Lake, floating gardens, wooden houseboats, Mughal gardens, snow-capped mountains reflection, misty morning heaven on earth'),
  'Kashmir Honeymoon Package':
    pkg('Romantic Kashmir valley India, couple on shikara boat in Dal Lake, tulip garden blooming flowers, snow peaks background, Mughal garden Nishat Bagh, paradise honeymoon destination'),

  // ── UTTARAKHAND ──
  'Char Dham Yatra':
    pkg('Char Dham pilgrimage Uttarakhand India, Kedarnath temple snow mountains, Badrinath temple, Gangotri glacier, Yamunotri shrine, Himalayan pilgrims trek, sacred rivers, divine spiritual journey'),
  'Mussoorie Hills Package':
    pkg('Mussoorie Queen of Hills Uttarakhand India, misty hillstation town, Kempty Falls waterfall, Gun Hill ropeway, winding mountain roads, lush pine forests, colonial era architecture, valley views'),
  'Nainital Lake Tour':
    pkg('Naini Lake Nainital Uttarakhand India, emerald green lake surrounded by forested hills, colourful rowboats on water, Naina Devi Temple, snow view point cable car, peaceful hill station'),
  'Varanasi Spiritual Journey':
    pkg('Varanasi Ganga Ghats Uttar Pradesh India, Dashashwamedh Ghat evening Ganga Aarti ceremony, flickering oil lamps on river, Hindu priests performing rituals, ancient temples, mystical spiritual atmosphere'),

  // ── HIMACHAL PRADESH ──
  'Spiti Valley Expedition':
    pkg('Spiti Valley cold desert Himachal Pradesh India, Key Monastery on barren hillside, rugged moonscape terrain, Chandratal Lake reflection, Buddhist monastery perched on cliff, remote stark beauty'),
  'Manali Adventure Tour':
    pkg('Manali Himachal Pradesh India, Solang Valley snow mountains, river rafting in Beas river, Rohtang Pass snowcap, adventure paragliding, Rohtang tunnel, Hadimba temple deodar forest'),
  'Shimla Family Vacation':
    pkg('Shimla Mall Road Himachal Pradesh India, colonial British era architecture, Christ Church, Ridge ground with mountain views, Kufri snow activities, family fun, toy train on narrow gauge railway'),

  // ── PUNJAB ──
  'Amritsar Golden Temple Tour':
    pkg('Harmandir Sahib Golden Temple Amritsar Punjab India, shimmering gold reflection in sacred Amrit Sarovar pool, Sikh devotees bathing, white marble causeway, serene dawn light, spiritual magnificence'),

  // ── UTTAR PRADESH ──
  'Agra Taj Mahal Tour':
    pkg('Taj Mahal Agra Uttar Pradesh India, white marble mausoleum reflecting in long water channel, Mughal garden, symmetrical architecture, sunrise golden light, couple at iconic symbol of eternal love'),

  // ── RAJASTHAN ──
  'Jaipur Royal Heritage Tour':
    pkg('Amer Fort Jaipur Pink City Rajasthan India, elephant ride up to amber fort, Hawa Mahal palace of winds, City Palace courtyard, vibrant bazaar, Jantar Mantar observatory, royal heritage charm'),
  'Jaisalmer Desert Safari':
    pkg('Jaisalmer desert safari Rajasthan India, camel caravan riding through golden Sam sand dunes at sunset, desert camp with colourful tents, cultural folk dancers bonfire at night, Thar desert magic'),
  'Udaipur Lake City Package':
    pkg('Lake Pichola Udaipur City of Lakes Rajasthan India, boat ride at sunset, Lake Palace hotel floating in water, City Palace on lakefront, romantic gondola, Aravalli hills, most romantic city India'),
  'Rajasthan Luxury Tour':
    pkg('Luxury heritage hotel Rajasthan India, Taj Rambagh Palace Jaipur, Umaid Bhawan Jodhpur, Taj Lake Palace Udaipur, royal suite with pool, elephant polo, fine dining, regal palatial interior'),

  // ── MAHARASHTRA ──
  'Ajanta Ellora Heritage Tour':
    pkg('Ajanta Ellora caves Aurangabad Maharashtra India, ancient Buddhist rock-cut cave paintings, massive Kailasa temple Ellora monolithic, intricate cave sculptures, UNESCO world heritage, historic grandeur'),
  'Mumbai City Explore':
    pkg('Gateway of India Mumbai Maharashtra skyline, iconic arch monument at waterfront, Queen Victoria gothic buildings, Marine Drive queen necklace night lights, Elephanta caves ferry, bustling megacity'),
  'Lonavala Weekend Tour':
    pkg('Lonavala Khandala Maharashtra monsoon green valleys, Tiger Point viewpoint, Bhushi Dam waterfall overflow, Karla caves ancient rock cut, lush Western Ghats, rainy season lush green escape'),
  'Mahabaleshwar Retreat':
    pkg('Mahabaleshwar Maharashtra hill station, strawberry farms valley, Venna Lake boating, Arthur Seat viewpoint, Pratapgad fort trek, Wilson Point sunrise, misty emerald green hills retreat'),

  // ── TELANGANA ──
  'Hyderabad Heritage Tour':
    pkg('Charminar Hyderabad Telangana India, 16th century four-minaret monument at sunset, pearl market laad bazaar below, Golconda Fort dramatic ruins, Hussain Sagar Buddha statue island, biryani city'),
  'Ramoji Film City Package':
    pkg('Ramoji Film City Hyderabad Telangana India, world largest film studio complex, movie set recreations, live shows entertainment, theme park rides, European garden, Bollywood sets, family fun'),

  // ── ANDHRA PRADESH ──
  'Araku Valley Tour':
    pkg('Araku Valley Eastern Ghats Andhra Pradesh India, lush green coffee plantations, Borra limestone caves interior, Katiki waterfalls, Vistadome train panoramic mountain ride, tribal village culture'),
  'Tirupati Spiritual Package':
    pkg('Tirumala Venkateswara Temple Tirupati Andhra Pradesh India, sacred hilltop temple with golden gopuram, millions of pilgrims devotees, prasadam offering, laddu, Seshachalam forest hills, divine darshan'),

  // ── TAMIL NADU ──
  'Ooty Hill Station Tour':
    pkg('Ooty Udhagamandalam Nilgiri hills Tamil Nadu India, Nilgiri Mountain Railway toy train through tea gardens, Botanical garden flowers, Ooty lake boating, Doddabetta peak mist, rolling tea estates'),
  'Kodaikanal Family Package':
    pkg('Kodaikanal lake Tamil Nadu India, paddle boats on star-shaped lake, Silver Cascade falls, Pillar Rocks misty viewpoint, Coakers Walk cliff edge, pine forest picnic, cool weather family getaway'),
  'Madurai Temple Heritage Tour':
    pkg('Meenakshi Amman Temple Madurai Tamil Nadu India, towering gopuram with thousands of colorful sculptured deities, night illumination, devotees at temple tank, vibrant religious city, cultural heritage'),
  'Rameshwaram Pilgrimage Tour':
    pkg('Ramanathaswamy Temple Rameshwaram Tamil Nadu India, sacred island pilgrimage, longest temple corridor in India, Pamban bridge sea crossing, Dhanushkodi ruins, Gulf of Mannar, pilgrim rituals'),

  // ── KERALA ──
  'Munnar Tea Garden Tour':
    pkg('Munnar tea plantations Kerala India, endless rolling green tea gardens, women plucking tea leaves, misty Western Ghats hills, Eravikulam National Park Nilgiri Tahr, cool foggy mountain retreat'),
  'Kerala Backwater Luxury Tour':
    pkg('Kerala backwaters luxury Kumarakom Alleppey India, private luxury houseboat gliding through palm-lined backwater canals, Ayurvedic spa, bird sanctuary, village life, serene tropical paradise'),
  'Wayanad Nature Escape':
    pkg('Wayanad Kerala forests waterfalls India, Soochipara Chembra waterfalls in dense jungle, Edakkal prehistoric cave, Banasura Sagar dam, wild elephant reserve, misty rainforest, nature getaway'),
  'Alleppey Houseboat Experience':
    pkg('Alleppey Alappuzha houseboat Kerala backwaters India, traditional kettuvallam rice barge houseboat floating on tranquil backwater canal, coconut palm reflections, sunset on waterway, romantic cruise'),

  // ── GOA ──
  'Goa Water Sports Package':
    pkg('Goa water sports adventure India, parasailing high above turquoise sea beach, jet ski speedboat, scuba diving coral reefs, banana boat ride, vibrant beach activity, thrill seeker tropical ocean fun'),
  'South Goa Luxury Escape':
    pkg('South Goa luxury beach resort India, private 5-star infinity pool overlooking untouched Palolem beach, pristine white sand shoreline, swaying palm trees, elegant resort interior, sunset luxury vacation'),
  'North Goa Beach Explorer':
    pkg('North Goa popular beaches India, Baga Calangute beach full of colorful beach shacks, water sports, Aguada Fort overlooking sea, Anjuna flea market, vibrant Goa nightlife, tropical beach party atmosphere'),
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
      console.log(`⚠️  NOT FOUND IN DB: ${title}`);
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
  console.log('\n🔌 Disconnected. All done!');
}

updateImages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
