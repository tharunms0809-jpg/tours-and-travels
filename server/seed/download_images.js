const fs = require('fs');
const path = require('path');
const https = require('https');

const MOCK_PACKAGES = [
  { dest: 'goa,beach', filename: 'north_goa_beach.jpg' },
  { dest: 'goa,luxury', filename: 'south_goa_luxury.jpg' },
  { dest: 'goa,watersports', filename: 'goa_watersports.jpg' },
  { dest: 'munnar,tea', filename: 'munnar_tea.jpg' },
  { dest: 'kerala,houseboat', filename: 'alleppey_houseboat.jpg' },
  { dest: 'wayanad,nature', filename: 'wayanad_nature.jpg' },
  { dest: 'kerala,luxury', filename: 'kerala_luxury.jpg' },
  { dest: 'ooty,hill', filename: 'ooty_hill.jpg' },
  { dest: 'kodaikanal', filename: 'kodaikanal.jpg' },
  { dest: 'rameshwaram,temple', filename: 'rameshwaram.jpg' },
  { dest: 'madurai,temple', filename: 'madurai.jpg' },
  { dest: 'araku,valley', filename: 'araku_valley.jpg' },
  { dest: 'tirupati,temple', filename: 'tirupati.jpg' },
  { dest: 'hyderabad,monument', filename: 'hyderabad.jpg' },
  { dest: 'ramoji,film', filename: 'ramoji.jpg' },
  { dest: 'mahabaleshwar', filename: 'mahabaleshwar.jpg' },
  { dest: 'lonavala', filename: 'lonavala.jpg' },
  { dest: 'mumbai,city', filename: 'mumbai.jpg' },
  { dest: 'ajanta,caves', filename: 'ajanta_ellora.jpg' },
  { dest: 'jaipur,fort', filename: 'jaipur.jpg' },
  { dest: 'udaipur,lake', filename: 'udaipur.jpg' },
  { dest: 'jaisalmer,desert', filename: 'jaisalmer.jpg' },
  { dest: 'rajasthan,palace', filename: 'rajasthan_luxury.jpg' },
  { dest: 'manali,snow', filename: 'manali.jpg' },
  { dest: 'shimla', filename: 'shimla.jpg' },
  { dest: 'spiti,valley', filename: 'spiti.jpg' },
  { dest: 'nainital,lake', filename: 'nainital.jpg' },
  { dest: 'mussoorie', filename: 'mussoorie.jpg' },
  { dest: 'himalayas,temple', filename: 'chardham.jpg' },
  { dest: 'srinagar,lake', filename: 'srinagar.jpg' },
  { dest: 'gulmarg,snow', filename: 'gulmarg.jpg' },
  { dest: 'kashmir,valley', filename: 'kashmir_honeymoon.jpg' },
  { dest: 'amritsar,temple', filename: 'amritsar.jpg' },
  { dest: 'tajmahal', filename: 'agra.jpg' },
  { dest: 'varanasi,ghat', filename: 'varanasi.jpg' },
  { dest: 'khajuraho,temple', filename: 'khajuraho.jpg' },
  { dest: 'tiger,safari', filename: 'bandhavgarh.jpg' },
  { dest: 'statue,unity', filename: 'statue_of_unity.jpg' },
  { dest: 'kutch,desert', filename: 'rann_of_kutch.jpg' },
  { dest: 'darjeeling,tea', filename: 'darjeeling.jpg' },
  { dest: 'sundarbans,tiger', filename: 'sundarbans.jpg' },
  { dest: 'puri,temple', filename: 'puri.jpg' },
  { dest: 'konark,temple', filename: 'konark.jpg' },
  { dest: 'gangtok', filename: 'gangtok.jpg' },
  { dest: 'sikkim,mountains', filename: 'north_sikkim.jpg' },
  { dest: 'kaziranga,rhino', filename: 'kaziranga.jpg' },
  { dest: 'meghalaya,waterfall', filename: 'meghalaya.jpg' },
  { dest: 'ladakh,bike', filename: 'ladakh_bike.jpg' },
  { dest: 'pangong,lake', filename: 'pangong_lake.jpg' },
  { dest: 'andaman,beach', filename: 'andaman_island.jpg' }
];

const assetsDir = path.join(__dirname, '..', '..', 'client', 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filepath, buffer);
}

async function start() {
  console.log(`Downloading ${MOCK_PACKAGES.length} images...`);
  
  for (let i = 0; i < MOCK_PACKAGES.length; i++) {
    const pkg = MOCK_PACKAGES[i];
    const url = `https://loremflickr.com/800/600/${pkg.dest}`;
    const filepath = path.join(assetsDir, pkg.filename);
    
    try {
      await downloadImage(url, filepath);
      console.log(`[${i+1}/${MOCK_PACKAGES.length}] Downloaded ${pkg.filename}`);
      // Small delay to not overwhelm the server
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`Failed to download ${pkg.filename}:`, err.message);
    }
  }
  
  console.log('All images downloaded successfully!');
}

start();
