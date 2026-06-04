const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Package = require('../models/Package');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb');
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@toursandtravels.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin'
    });
    console.log('👤 Admin user created (email: admin@toursandtravels.com, password: admin123)');

    // Create demo user
    await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'user123',
      phone: '9876543211',
      role: 'user'
    });
    console.log('👤 Demo user created (email: rahul@example.com, password: user123)');

    // Sample tour packages
    const packages = [
      {
        title: 'Enchanting Goa Beach Holiday',
        description: 'Experience the magic of Goa with its stunning beaches, vibrant nightlife, Portuguese architecture, and delicious seafood cuisine. This package covers North and South Goa with visits to iconic beaches, historic churches, spice plantations, and water sports activities.',
        destination: 'Goa',
        price: 15999,
        duration: { days: 5, nights: 4 },
        groupSize: { min: 2, max: 15 },
        hotel: { name: 'The Leela Goa', rating: 5, type: 'Luxury' },
        transport: { type: 'Flight', details: 'Round trip flights from Delhi/Mumbai included' },
        images: [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        highlights: ['Baga Beach', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Water Sports', 'Night Cruise'],
        itinerary: [
          { day: 1, title: 'Arrival & North Goa', description: 'Check-in, visit Baga and Calangute beaches', activities: ['Airport pickup', 'Hotel check-in', 'Beach visit', 'Welcome dinner'] },
          { day: 2, title: 'Heritage Tour', description: 'Visit Old Goa churches and Panjim city', activities: ['Basilica of Bom Jesus', 'Se Cathedral', 'Panjim walking tour', 'Miramar Beach'] },
          { day: 3, title: 'Adventure Day', description: 'Water sports and Dudhsagar Falls', activities: ['Parasailing', 'Jet skiing', 'Banana boat ride', 'Dudhsagar Falls trek'] },
          { day: 4, title: 'South Goa', description: 'Explore tranquil South Goa beaches', activities: ['Colva Beach', 'Benaulim Beach', 'Spice plantation visit', 'Night cruise'] },
          { day: 5, title: 'Departure', description: 'Checkout and departure', activities: ['Souvenir shopping', 'Airport transfer'] }
        ],
        inclusions: ['Hotel accommodation', 'Daily breakfast', 'Airport transfers', 'Sightseeing as per itinerary', 'Water sports'],
        exclusions: ['Lunch and dinner', 'Personal expenses', 'Travel insurance'],
        availability: true,
        featured: true,
        rating: 4.5,
        reviewCount: 128,
        category: 'Beach'
      },
      {
        title: 'Majestic Manali Snow Adventure',
        description: 'Escape to the breathtaking Himalayan valley of Manali. Enjoy snow-capped mountains, adventure activities, ancient temples, and the serene beauty of Solang Valley and Rohtang Pass. Perfect for adventure seekers and nature lovers.',
        destination: 'Manali',
        price: 12999,
        duration: { days: 6, nights: 5 },
        groupSize: { min: 2, max: 20 },
        hotel: { name: 'Snow Valley Resorts', rating: 4, type: 'Premium' },
        transport: { type: 'Bus', details: 'AC Volvo bus from Delhi included' },
        images: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
          'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800'
        ],
        highlights: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali', 'River Rafting'],
        itinerary: [
          { day: 1, title: 'Delhi to Manali', description: 'Overnight journey from Delhi', activities: ['Board Volvo bus', 'Scenic journey through mountains'] },
          { day: 2, title: 'Arrival & Local Sightseeing', description: 'Arrive and explore Manali', activities: ['Hotel check-in', 'Mall Road', 'Hadimba Temple', 'Tibetan Monastery'] },
          { day: 3, title: 'Solang Valley', description: 'Adventure activities at Solang Valley', activities: ['Paragliding', 'Zorbing', 'Snow activities', 'Rope way'] },
          { day: 4, title: 'Rohtang Pass', description: 'Full day excursion to Rohtang Pass', activities: ['Snow point', 'Photography', 'Snow sports', 'Mountain views'] },
          { day: 5, title: 'Kullu & Rafting', description: 'Visit Kullu valley and river rafting', activities: ['Kullu valley', 'River rafting in Beas', 'Local market', 'Farewell dinner'] },
          { day: 6, title: 'Departure', description: 'Return journey to Delhi', activities: ['Checkout', 'Board return bus'] }
        ],
        inclusions: ['Hotel stay', 'Daily breakfast & dinner', 'Volvo bus tickets', 'Sightseeing', 'River rafting'],
        exclusions: ['Rohtang Pass permit', 'Adventure activity charges', 'Personal expenses'],
        availability: true,
        featured: true,
        rating: 4.3,
        reviewCount: 95,
        category: 'Hill Station'
      },
      {
        title: 'Kerala Backwater Paradise',
        description: 'Discover God\'s Own Country with its lush green backwaters, tea plantations, wildlife sanctuaries, and pristine beaches. Cruise through the enchanting backwaters of Alleppey on a traditional houseboat.',
        destination: 'Kerala',
        price: 22999,
        duration: { days: 7, nights: 6 },
        groupSize: { min: 2, max: 12 },
        hotel: { name: 'Kumarakom Lake Resort', rating: 5, type: 'Luxury' },
        transport: { type: 'Flight', details: 'Round trip flights to Kochi included' },
        images: [
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800'
        ],
        highlights: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Periyar Wildlife', 'Kovalam Beach', 'Kathakali Show'],
        itinerary: [
          { day: 1, title: 'Arrival at Kochi', description: 'Arrive and explore Fort Kochi', activities: ['Airport pickup', 'Fort Kochi walk', 'Chinese fishing nets', 'Welcome dinner'] },
          { day: 2, title: 'Kochi to Munnar', description: 'Drive to the hill station of Munnar', activities: ['Cheeyappara Falls', 'Tea Museum', 'Tea plantation walk'] },
          { day: 3, title: 'Munnar Sightseeing', description: 'Explore Munnar attractions', activities: ['Eravikulam National Park', 'Mattupetty Dam', 'Echo Point', 'Flower garden'] },
          { day: 4, title: 'Thekkady', description: 'Visit Periyar Wildlife Sanctuary', activities: ['Periyar boat cruise', 'Spice plantation tour', 'Elephant ride', 'Kathakali show'] },
          { day: 5, title: 'Alleppey Houseboat', description: 'Backwater cruise on houseboat', activities: ['Board houseboat', 'Backwater cruise', 'Village visit', 'Sunset views'] },
          { day: 6, title: 'Kovalam Beach', description: 'Relax at Kovalam Beach', activities: ['Beach time', 'Lighthouse visit', 'Ayurvedic massage', 'Seafood dinner'] },
          { day: 7, title: 'Departure', description: 'Transfer to airport', activities: ['Checkout', 'Airport transfer'] }
        ],
        inclusions: ['Accommodation', 'All meals', 'Flights', 'Houseboat stay', 'Sightseeing', 'Transfers'],
        exclusions: ['Personal expenses', 'Camera fees', 'Tips'],
        availability: true,
        featured: true,
        rating: 4.8,
        reviewCount: 210,
        category: 'Cultural'
      },
      {
        title: 'Royal Rajasthan Heritage Tour',
        description: 'Step into the world of Maharajas with this grand Rajasthan tour covering Jaipur, Jodhpur, Udaipur, and Jaisalmer. Experience majestic forts, colorful bazaars, desert safaris, and royal hospitality.',
        destination: 'Rajasthan',
        price: 28999,
        duration: { days: 8, nights: 7 },
        groupSize: { min: 2, max: 20 },
        hotel: { name: 'Taj Lake Palace', rating: 5, type: 'Luxury' },
        transport: { type: 'Mixed', details: 'AC car for local sightseeing, inter-city trains' },
        images: [
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
        ],
        highlights: ['Amber Fort', 'City Palace', 'Mehrangarh Fort', 'Thar Desert Safari', 'Lake Pichola'],
        itinerary: [
          { day: 1, title: 'Arrival at Jaipur', description: 'Welcome to the Pink City', activities: ['Airport pickup', 'Hotel check-in', 'Hawa Mahal visit', 'Dinner'] },
          { day: 2, title: 'Jaipur Sightseeing', description: 'Explore the Pink City', activities: ['Amber Fort', 'City Palace', 'Jantar Mantar', 'Johari Bazaar'] },
          { day: 3, title: 'Jaipur to Jodhpur', description: 'Travel to the Blue City', activities: ['Drive to Jodhpur', 'Mehrangarh Fort', 'Jaswant Thada', 'Blue city walk'] },
          { day: 4, title: 'Jodhpur to Jaisalmer', description: 'Journey to the Golden City', activities: ['Drive to Jaisalmer', 'Jaisalmer Fort', 'Patwon ki Haveli'] },
          { day: 5, title: 'Thar Desert', description: 'Desert adventure', activities: ['Camel safari', 'Sand dunes', 'Desert camping', 'Folk music & dance'] },
          { day: 6, title: 'Jaisalmer to Udaipur', description: 'Travel to City of Lakes', activities: ['Drive to Udaipur', 'Ranakpur temples enroute', 'Evening at Lake Pichola'] },
          { day: 7, title: 'Udaipur Sightseeing', description: 'Explore the Venice of East', activities: ['City Palace', 'Saheliyon ki Bari', 'Boat ride on Lake Pichola', 'Farewell dinner'] },
          { day: 8, title: 'Departure', description: 'Transfer to airport', activities: ['Checkout', 'Airport transfer'] }
        ],
        inclusions: ['Heritage hotel stays', 'Daily breakfast & dinner', 'AC transport', 'Sightseeing', 'Desert safari'],
        exclusions: ['Flights', 'Lunch', 'Monument entry fees', 'Personal expenses'],
        availability: true,
        featured: true,
        rating: 4.6,
        reviewCount: 175,
        category: 'Cultural'
      },
      {
        title: 'Andaman Island Escape',
        description: 'Discover the tropical paradise of Andaman Islands with crystal-clear waters, pristine beaches, coral reefs, and lush green forests. Perfect for snorkeling, scuba diving, and beach lovers.',
        destination: 'Andaman',
        price: 35999,
        duration: { days: 6, nights: 5 },
        groupSize: { min: 2, max: 10 },
        hotel: { name: 'Havelock Island Resort', rating: 4, type: 'Premium' },
        transport: { type: 'Flight', details: 'Round trip flights to Port Blair included' },
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
          'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800'
        ],
        highlights: ['Radhanagar Beach', 'Cellular Jail', 'Scuba Diving', 'Glass Bottom Boat', 'Elephant Beach'],
        itinerary: [
          { day: 1, title: 'Port Blair', description: 'Arrival and Cellular Jail', activities: ['Airport pickup', 'Cellular Jail visit', 'Light & Sound show'] },
          { day: 2, title: 'Havelock Island', description: 'Ferry to Havelock Island', activities: ['Ferry ride', 'Radhanagar Beach', 'Beach sunset'] },
          { day: 3, title: 'Water Activities', description: 'Scuba diving and snorkeling', activities: ['Scuba diving', 'Snorkeling at Elephant Beach', 'Glass bottom boat'] },
          { day: 4, title: 'Neil Island', description: 'Day trip to Neil Island', activities: ['Ferry to Neil', 'Natural bridge', 'Laxmanpur Beach', 'Coral viewing'] },
          { day: 5, title: 'Port Blair', description: 'Return and explore', activities: ['Return to Port Blair', 'Ross Island', 'North Bay coral reef', 'Shopping'] },
          { day: 6, title: 'Departure', description: 'Airport transfer', activities: ['Checkout', 'Airport drop'] }
        ],
        inclusions: ['Resort stay', 'All meals', 'Flights', 'Ferry tickets', 'Sightseeing', 'Scuba diving'],
        exclusions: ['Personal expenses', 'Extra water sports', 'Tips'],
        availability: true,
        featured: false,
        rating: 4.7,
        reviewCount: 89,
        category: 'Beach'
      },
      {
        title: 'Mystical Ladakh Road Trip',
        description: 'Embark on the ultimate road trip adventure through the stunning landscapes of Ladakh. From high mountain passes to pristine lakes, ancient monasteries to vibrant culture — this trip has it all.',
        destination: 'Ladakh',
        price: 25999,
        duration: { days: 7, nights: 6 },
        groupSize: { min: 4, max: 12 },
        hotel: { name: 'The Grand Dragon', rating: 4, type: 'Premium' },
        transport: { type: 'Mixed', details: 'Flights + SUV for local transport' },
        images: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        ],
        highlights: ['Pangong Lake', 'Nubra Valley', 'Khardung La Pass', 'Magnetic Hill', 'Thiksey Monastery'],
        itinerary: [
          { day: 1, title: 'Arrival at Leh', description: 'Acclimatization day', activities: ['Airport pickup', 'Rest and acclimatize', 'Leh market walk'] },
          { day: 2, title: 'Leh Sightseeing', description: 'Explore Leh town', activities: ['Shanti Stupa', 'Leh Palace', 'Hall of Fame', 'Magnetic Hill'] },
          { day: 3, title: 'Nubra Valley', description: 'Drive to Nubra via Khardung La', activities: ['Khardung La Pass', 'Diskit Monastery', 'Hunder sand dunes', 'Double hump camel ride'] },
          { day: 4, title: 'Nubra to Pangong', description: 'Journey to Pangong Lake', activities: ['Scenic drive', 'Pangong Lake', 'Lakeside camping', 'Stargazing'] },
          { day: 5, title: 'Pangong to Leh', description: 'Return via Chang La', activities: ['Sunrise at Pangong', 'Chang La pass', 'Thiksey Monastery', 'Hemis Monastery'] },
          { day: 6, title: 'Leh Exploration', description: 'Free day and rafting', activities: ['Zanskar River rafting', 'Local market', 'Farewell dinner'] },
          { day: 7, title: 'Departure', description: 'Transfer to airport', activities: ['Checkout', 'Airport drop'] }
        ],
        inclusions: ['Hotel & camp stay', 'All meals', 'SUV transport', 'Inner Line permits', 'Rafting'],
        exclusions: ['Flights to Leh', 'Personal expenses', 'Oxygen cylinders'],
        availability: true,
        featured: true,
        rating: 4.9,
        reviewCount: 156,
        category: 'Adventure'
      },
      {
        title: 'Shimla Kullu Valley Delight',
        description: 'A perfect family getaway to the Queen of Hills — Shimla, combined with the beautiful Kullu Valley. Enjoy colonial architecture, scenic toy train rides, adventure activities, and apple orchards.',
        destination: 'Shimla',
        price: 10999,
        duration: { days: 5, nights: 4 },
        groupSize: { min: 2, max: 20 },
        hotel: { name: 'Wildflower Hall', rating: 4, type: 'Premium' },
        transport: { type: 'Bus', details: 'AC Volvo from Delhi, local car included' },
        images: [
          'https://images.unsplash.com/photo-1597074866923-dc0589150458?w=800',
          'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800'
        ],
        highlights: ['Mall Road', 'Toy Train', 'Kufri', 'Kullu Valley', 'Apple Orchards'],
        itinerary: [
          { day: 1, title: 'Delhi to Shimla', description: 'Journey to Shimla', activities: ['Board Volvo bus', 'Arrive Shimla', 'Mall Road evening walk'] },
          { day: 2, title: 'Shimla Sightseeing', description: 'Explore Shimla', activities: ['Christ Church', 'Ridge', 'Jakhoo Temple', 'Toy train ride'] },
          { day: 3, title: 'Kufri Excursion', description: 'Day trip to Kufri', activities: ['Kufri fun world', 'Horse riding', 'Apple orchards', 'Scenic views'] },
          { day: 4, title: 'Kullu Valley', description: 'Visit Kullu', activities: ['Drive to Kullu', 'Great Himalayan National Park', 'River crossing', 'Local bazaar'] },
          { day: 5, title: 'Departure', description: 'Return to Delhi', activities: ['Checkout', 'Board return bus'] }
        ],
        inclusions: ['Hotel stay', 'Breakfast & dinner', 'Volvo tickets', 'Local transport', 'Sightseeing'],
        exclusions: ['Lunch', 'Activity charges', 'Personal expenses'],
        availability: true,
        featured: false,
        rating: 4.1,
        reviewCount: 67,
        category: 'Hill Station'
      },
      {
        title: 'Varanasi Spiritual Journey',
        description: 'Immerse yourself in the spiritual capital of India. Witness the mesmerizing Ganga Aarti, explore ancient temples, take a boat ride on the Ganges, and experience the rich cultural heritage of Varanasi.',
        destination: 'Varanasi',
        price: 8999,
        duration: { days: 4, nights: 3 },
        groupSize: { min: 2, max: 25 },
        hotel: { name: 'BrijRama Palace', rating: 4, type: 'Premium' },
        transport: { type: 'Train', details: 'AC train tickets from Delhi included' },
        images: [
          'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
          'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800'
        ],
        highlights: ['Ganga Aarti', 'Kashi Vishwanath', 'Boat Ride', 'Sarnath', 'Silk Weaving'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Arrive and evening Ganga Aarti', activities: ['Station pickup', 'Hotel check-in', 'Dashashwamedh Ghat', 'Ganga Aarti'] },
          { day: 2, title: 'Temple Tour', description: 'Visit sacred temples', activities: ['Morning boat ride', 'Kashi Vishwanath Temple', 'Tulsi Manas Temple', 'BHU campus'] },
          { day: 3, title: 'Sarnath & Culture', description: 'Explore Buddhist heritage', activities: ['Sarnath excursion', 'Dhamek Stupa', 'Silk weaving demo', 'Street food tour'] },
          { day: 4, title: 'Departure', description: 'Morning sunrise boat ride and departure', activities: ['Sunrise boat ride', 'Checkout', 'Station transfer'] }
        ],
        inclusions: ['Hotel stay', 'Breakfast', 'Train tickets', 'Boat rides', 'Sightseeing guide'],
        exclusions: ['Lunch & dinner', 'Temple donations', 'Personal expenses'],
        availability: true,
        featured: false,
        rating: 4.4,
        reviewCount: 112,
        category: 'Pilgrimage'
      },
      {
        title: 'Jim Corbett Wildlife Safari',
        description: 'Get up close with the majestic Royal Bengal Tiger at Jim Corbett National Park. Enjoy thrilling jungle safaris, bird watching, and the beauty of the Himalayan foothills in this ultimate wildlife adventure.',
        destination: 'Jim Corbett',
        price: 14999,
        duration: { days: 4, nights: 3 },
        groupSize: { min: 2, max: 8 },
        hotel: { name: 'Corbett Jungle Resort', rating: 4, type: 'Premium' },
        transport: { type: 'Bus', details: 'AC bus from Delhi, jeep safaris included' },
        images: [
          'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
          'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800'
        ],
        highlights: ['Jeep Safari', 'Tiger Spotting', 'Bird Watching', 'Corbett Falls', 'Elephant Safari'],
        itinerary: [
          { day: 1, title: 'Delhi to Corbett', description: 'Journey and arrival', activities: ['Drive to Corbett', 'Resort check-in', 'Nature walk', 'Bonfire dinner'] },
          { day: 2, title: 'Jungle Safari', description: 'Full day safari experience', activities: ['Morning jeep safari', 'Dhikala zone', 'Afternoon elephant ride', 'Wildlife photography'] },
          { day: 3, title: 'Exploration', description: 'More safari and nature', activities: ['Morning safari (Bijrani zone)', 'Corbett Falls', 'Bird watching', 'Cultural show'] },
          { day: 4, title: 'Departure', description: 'Return to Delhi', activities: ['Morning nature walk', 'Checkout', 'Drive back to Delhi'] }
        ],
        inclusions: ['Resort stay', 'All meals', 'Transport', '2 Jeep safaris', 'Elephant safari', 'Park entry'],
        exclusions: ['Camera fees', 'Extra safaris', 'Personal expenses'],
        availability: true,
        featured: false,
        rating: 4.5,
        reviewCount: 78,
        category: 'Wildlife'
      },
      {
        title: 'Darjeeling Tea Garden Retreat',
        description: 'Experience the charm of Darjeeling — the Queen of the Himalayas. Visit world-famous tea gardens, ride the UNESCO Heritage Toy Train, witness sunrise over Kanchenjunga, and explore vibrant Tibetan culture.',
        destination: 'Darjeeling',
        price: 13999,
        duration: { days: 5, nights: 4 },
        groupSize: { min: 2, max: 15 },
        hotel: { name: 'Mayfair Darjeeling', rating: 4, type: 'Premium' },
        transport: { type: 'Flight', details: 'Flight to Bagdogra + car transfer' },
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
        ],
        highlights: ['Tiger Hill Sunrise', 'Tea Gardens', 'Toy Train', 'Batasia Loop', 'Peace Pagoda'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Fly to Bagdogra, drive to Darjeeling', activities: ['Airport pickup', 'Scenic drive', 'Hotel check-in', 'Mall walk'] },
          { day: 2, title: 'Tiger Hill & Town', description: 'Sunrise and town tour', activities: ['Tiger Hill sunrise', 'Batasia Loop', 'Himalayan Zoo', 'Mountaineering Institute'] },
          { day: 3, title: 'Tea & Train', description: 'Tea gardens and Toy Train', activities: ['Happy Valley Tea Estate', 'Tea tasting', 'Toy Train ride', 'Japanese Peace Pagoda'] },
          { day: 4, title: 'Rock Garden & Gangtok', description: 'Day excursion', activities: ['Rock Garden', 'Ganga Maya Park', 'Tibetan Refugee Centre', 'Nightlife exploration'] },
          { day: 5, title: 'Departure', description: 'Transfer to Bagdogra airport', activities: ['Checkout', 'Shopping', 'Airport transfer'] }
        ],
        inclusions: ['Hotel stay', 'Breakfast & dinner', 'Flights', 'Local transport', 'Tea garden entry', 'Toy Train'],
        exclusions: ['Lunch', 'Tips', 'Personal expenses'],
        availability: true,
        featured: false,
        rating: 4.3,
        reviewCount: 54,
        category: 'Hill Station'
      }
    ];

    await Package.insertMany(packages);
    console.log(`📦 ${packages.length} tour packages seeded successfully`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:  admin@toursandtravels.com / admin123');
    console.log('User Login:   rahul@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
