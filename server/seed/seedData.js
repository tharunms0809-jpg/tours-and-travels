const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting Master Database Seeding...');

try {
  console.log('\n👥 Seeding Users...');
  execSync('node seed/seed_users.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('\n📦 Seeding India Packages...');
  execSync('node seed/all_india_packages.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('\n🗺️ Seeding Karnataka Packages...');
  execSync('node seed/karnataka_packages.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('\n✨ Database seeding completed successfully!');
} catch (error) {
  console.error('\n❌ Seeding failed:', error.message);
  process.exit(1);
}
