const fs = require('fs');
const path = require('path');
const https = require('https');

const prompts = [
  {
    name: 'badami',
    prompt: 'Ultra-realistic travel photography of ancient sandstone cave temples of Badami, Karnataka, intricate rock-cut architecture, historic carvings, dramatic golden sunrise lighting, reflection in Agastya Lake, vibrant colors, tourists exploring heritage site, cinematic composition, professional tourism advertisement, 4K ultra HD, wide-angle lens, no text, no watermark, no logo.'
  },
  {
    name: 'sakaleshpura',
    prompt: 'Breathtaking aerial view of Sakaleshpura Green Route, lush Western Ghats covered in mist, dense forests, railway bridge crossing valleys, monsoon greenery, clouds floating between mountains, cinematic landscape photography, vibrant colors, ultra-realistic travel poster, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'nandi_hills',
    prompt: 'Spectacular sunrise at Nandi Hills, Karnataka, golden sun emerging above clouds, viewpoint overlooking valleys, dramatic sky, travelers enjoying sunrise, serene atmosphere, realistic landscape photography, tourism banner design, ultra HD 4K, no text, no watermark, no logo.'
  },
  {
    name: 'pattadakal',
    prompt: 'Magnificent Pattadakal UNESCO World Heritage temples, ancient Chalukyan architecture, detailed stone carvings, warm evening sunlight, clear blue sky, heritage tourism photography, ultra-realistic, highly detailed, professional travel brochure image, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'aihole',
    prompt: 'Ancient temples of Aihole, Karnataka, cradle of Indian temple architecture, historic sandstone structures, intricate carvings, golden hour lighting, archaeological heritage landscape, realistic travel photography, ultra-detailed, cinematic tourism image, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'kemmanagundi',
    prompt: 'Scenic Kemmanagundi hill station, rolling green hills, mist-covered mountains, colorful flower gardens, winding roads, cool morning atmosphere, breathtaking panoramic landscape, realistic tourism photography, vibrant colors, 4K ultra HD, no text, no watermark, no logo.'
  },
  {
    name: 'belur',
    prompt: 'Stunning Chennakeshava Temple at Belur, intricate Hoysala architecture, detailed stone sculptures, heritage monument, warm golden sunlight, cultural tourism photography, ultra-realistic details, professional travel advertisement, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'dandeli',
    prompt: 'Exciting river rafting adventure in Dandeli, Karnataka, people rafting through rapids, dense jungle surroundings, action-packed scene, adventure tourism promotion, vibrant colors, realistic photography, cinematic composition, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'halebidu',
    prompt: 'Ancient ruins of Halebidu temple complex, Karnataka, intricate Hoysala carvings, historic atmosphere, dramatic lighting, cultural heritage tourism, realistic architectural photography, ultra-detailed stone sculptures, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'shivanasamudra',
    prompt: 'Majestic Shivanasamudra Twin Falls cascading through rocky cliffs, lush greenery, mist rising from waterfalls, monsoon season beauty, breathtaking natural scenery, realistic landscape photography, vibrant tourism poster, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'bandipur',
    prompt: 'Wildlife safari in Bandipur National Park, majestic tiger walking through forest trail, elephants and deer in natural habitat, golden morning light, realistic wildlife photography, adventure tourism banner, ultra HD 4K, no text, no watermark, no logo.'
  },
  {
    name: 'jog_falls',
    prompt: 'Mighty Jog Falls in Karnataka, one of India\'s tallest waterfalls, powerful water streams plunging into deep valley, misty atmosphere, lush green mountains, cinematic aerial photography, ultra-realistic travel destination image, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'varanasi',
    prompt: 'Spiritual sunrise at Varanasi Ghats, sacred Ganga River, devotees performing rituals, glowing temple lights, traditional boats, mystical atmosphere, realistic cultural photography, vibrant colors, travel advertisement, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'udupi',
    prompt: 'Udupi Krishna Temple combined with beautiful Malpe Beach coastline, spiritual and coastal tourism concept, golden sunset, temple architecture, palm trees, realistic travel photography, vibrant colors, ultra HD 4K, no text, no watermark, no logo.'
  },
  {
    name: 'murudeshwar',
    prompt: 'Giant Murudeshwar Shiva statue overlooking Arabian Sea, dramatic coastal landscape, temple complex, sunset sky, spiritual tourism destination, ultra-realistic photography, cinematic composition, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'darjeeling',
    prompt: 'Rolling tea gardens of Darjeeling, workers picking tea leaves, Himalayan mountains in background, morning mist, lush green landscape, peaceful retreat atmosphere, realistic travel photography, 4K ultra HD, no text, no watermark, no logo.'
  },
  {
    name: 'coorg',
    prompt: 'Beautiful Coorg landscape with coffee plantations, mist-covered hills, waterfalls, lush greenery, charming cottages, sunrise atmosphere, luxury travel destination photography, cinematic and realistic, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'mysore',
    prompt: 'Grand Mysore Palace illuminated at dusk, royal architecture, vibrant lights, cultural heritage, tourists admiring palace, ultra-realistic travel photography, majestic composition, tourism promotion image, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'chikkamagaluru',
    prompt: 'Chikkamagaluru coffee plantations, endless green coffee estates, misty hills, workers harvesting coffee beans, sunrise light, Western Ghats scenery, realistic tourism photography, ultra HD 4K, no text, no watermark, no logo.'
  },
  {
    name: 'hampi',
    prompt: 'Ancient ruins of Hampi, stone chariot, giant boulders, Vijayanagara architecture, golden sunset, UNESCO World Heritage site, realistic archaeological landscape photography, cinematic travel poster, 4K, no text, no watermark, no logo.'
  },
  {
    name: 'gokarna',
    prompt: 'Serene Gokarna beach with Mahabaleshwar Temple nearby, golden sunset, peaceful shoreline, palm trees, spiritual and beach tourism combination, realistic travel photography, ultra HD 4K, no text, no watermark, no logo.'
  },
  {
    name: 'shimla',
    prompt: 'Scenic Shimla and Kullu Valley, snow-capped Himalayan mountains, pine forests, colorful houses, winding roads, breathtaking landscape, realistic tourism photography, vibrant colors, cinematic 4K travel poster, no text, no watermark, no logo.'
  }
];

const outDir = path.join(__dirname, 'client', 'public', 'assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(resolve);
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  for (const item of prompts) {
    console.log(`Downloading ${item.name}...`);
    const encodedPrompt = encodeURIComponent(item.prompt);
    // Requesting 1280x720 for web efficiency but maintaining quality
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true`;
    const filepath = path.join(outDir, `${item.name}_hero.jpg`);
    try {
      await downloadImage(url, filepath);
      console.log(`Successfully saved ${filepath}`);
    } catch (err) {
      console.error(`Failed to download ${item.name}:`, err);
    }
  }
  console.log('All downloads completed!');
}

run();
