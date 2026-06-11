const fs = require('fs');
const path = require('path');

const packages = {
  "Bheemeshwari Adventure Package": "River rafting, forest adventure",
  "Horanadu & Sringeri Spiritual Tour": "Temples of Horanadu and Sringeri",
  "Kodachadri Trek Package": "Kodachadri mountain trek",
  "Kemmanagundi Hill Station Tour": "Hills, viewpoints, waterfalls",
  "Biligiri Rangan Hills Wildlife Tour": "Wildlife sanctuary, forest",
  "KRS Dam & Brindavan Gardens Package": "KRS Dam and Brindavan Gardens",
  "Pangong Lake Adventure": "Pangong Lake, Ladakh",
  "Leh Ladakh Bike Expedition": "Bikes on Ladakh roads",
  "Kaziranga Wildlife Safari": "One-horned rhinoceros safari",
  "Shillong & Cherrapunji Tour": "Meghalaya waterfalls and valleys",
  "North Sikkim Adventure": "Snow mountains and valleys",
  "Rann of Kutch Festival Package": "White desert and festival",
  "Konark Heritage Package": "Konark Sun Temple",
  "Statue of Unity Tour": "Statue of Unity",
  "Sundarbans Wildlife Package": "Mangrove forests and wildlife",
  "Puri Jagannath Tour": "Jagannath Temple",
  "Darjeeling Tea Estate Tour": "Tea gardens and mountains",
  "Khajuraho Heritage Tour": "Khajuraho temples",
  "Bandhavgarh Wildlife Safari": "Tigers and jungle safari",
  "Gulmarg Snow Adventure": "Snow activities and mountains",
  "Char Dham Yatra": "Himalayan pilgrimage sites",
  "Amritsar Golden Temple Tour": "Golden Temple",
  "Mussoorie Hills Package": "Mussoorie hill views",
  "Varanasi Spiritual Journey": "Ganga ghats and temples",
  "Shimla Family Vacation": "Shimla hills and town",
  "Srinagar Paradise Tour": "Dal Lake and houseboats",
  "Agra Taj Mahal Tour": "Taj Mahal",
  "Nainital Lake Tour": "Nainital Lake",
  "Spiti Valley Expedition": "Spiti Valley landscapes",
  "Kashmir Honeymoon Package": "Romantic Kashmir scenery",
  "Jaipur Royal Heritage Tour": "Palaces and forts",
  "Jaisalmer Desert Safari": "Camel safari and desert",
  "Udaipur Lake City Package": "Lakes and palaces",
  "Manali Adventure Tour": "Mountains and adventure sports",
  "Ajanta Ellora Heritage Tour": "Ajanta and Ellora caves",
  "Mumbai City Explore": "Gateway of India and skyline",
  "Lonavala Weekend Tour": "Green valleys and waterfalls",
  "Hyderabad Heritage Tour": "Charminar and heritage sites",
  "Rajasthan Luxury Tour": "Luxury palaces and forts",
  "Mahabaleshwar Retreat": "Hills and strawberry farms",
  "Ramoji Film City Package": "Ramoji Film City",
  "Rameshwaram Pilgrimage Tour": "Ramanathaswamy Temple",
  "Araku Valley Tour": "Araku landscapes and coffee plantations",
  "Ooty Hill Station Tour": "Tea gardens and hills",
  "Kodaikanal Family Package": "Kodaikanal lake and hills",
  "Madurai Temple Heritage Tour": "Meenakshi Temple",
  "Tirupati Spiritual Package": "Tirumala Temple",
  "Munnar Tea Garden Tour": "Tea plantations",
  "Kerala Backwater Luxury Tour": "Kerala backwaters",
  "Wayanad Nature Escape": "Forests and waterfalls",
  "Alleppey Houseboat Experience": "Houseboats",
  "Goa Water Sports Package": "Parasailing and water sports",
  "South Goa Luxury Escape": "Luxury beach resorts",
  "North Goa Beach Explorer": "Popular Goa beaches"
};

const getImageUrl = (query) => {
  const prompt = `${query}, ultra-realistic travel photography, 4K, vibrant colors, cinematic composition`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
};

const filesToUpdate = [
  path.join(__dirname, 'server', 'seed', 'india_packages.js'),
  path.join(__dirname, 'server', 'seed', 'all_india_packages.js'),
  path.join(__dirname, 'server', 'seed', 'karnataka_packages.js')
];

let modifiedCount = 0;
let modifiedFilesSet = new Set();

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    Object.keys(packages).forEach(pkgTitle => {
      // Find the package block
      // This regex looks for title: 'Package Name', followed by any characters until images: [...]
      // It's tricky to do multi-line regex reliably.
      // Better way: simply search line by line, keep track of current title.
    });
    
    // Line by line parsing
    const lines = content.split('\n');
    let currentTitle = null;
    let inPackage = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const titleMatch = line.match(/title:\s*['"](.+?)['"]/);
      if (titleMatch) {
        currentTitle = titleMatch[1];
      }
      
      if (currentTitle && packages[currentTitle]) {
        const imageMatch = line.match(/^\s*images:\s*\[(.*?)\]/);
        if (imageMatch) {
          const newUrl = getImageUrl(packages[currentTitle]);
          lines[i] = line.replace(/\[.*?\]/, `['${newUrl}']`);
          changed = true;
          modifiedCount++;
          // Reset title so we don't accidentally replace next image if missing title
          currentTitle = null;
        }
      }
    }
    
    if (changed) {
      fs.writeFileSync(file, lines.join('\n'), 'utf8');
      modifiedFilesSet.add(path.basename(file));
      console.log(`Updated ${path.basename(file)}`);
    }
  }
});

console.log(`Total packages updated: ${modifiedCount}`);
console.log(`Modified files: ${Array.from(modifiedFilesSet).join(', ')}`);
