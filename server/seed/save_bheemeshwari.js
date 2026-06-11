const fs = require('fs');
const path = require('path');

// Copy shivanasamudra (river/forest) as bheemeshwari placeholder
const src = path.join(__dirname, '../../client/public/assets/shivanasamudra_hero.jpg');
const dest = path.join(__dirname, '../../client/public/assets/bheemeshwari_hero.jpg');

if (!fs.existsSync(dest)) {
  fs.copyFileSync(src, dest);
  console.log('✓ Created bheemeshwari_hero.jpg');
} else {
  console.log('✓ bheemeshwari_hero.jpg already exists');
}
