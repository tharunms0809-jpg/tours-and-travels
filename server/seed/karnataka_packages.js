const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const Package = require('../models/Package');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';

const packages = [
  {
    title: 'Kudremukh Trek & Nature Package',
    description: 'Experience the pristine beauty of Kudremukh and its lush green landscapes.',
    destination: 'Kudremukh',
    state: 'Karnataka',
    price: 5999,
    duration: { days: 2, nights: 1 },
    category: 'Adventure',
    highlights: ['Kudremukh', 'Hanuman Gundi Falls', 'Tea Estates', 'Scenic Viewpoints'],
    inclusions: ['AC Travel', 'Tour Guide', 'Hotel Stay', 'Breakfast, Lunch & Dinner', 'Trekking Assistance'],
    hotel: { type: 'Standard' },
    images: ['/assets/kemmanagundi_hero.jpg']
  },
  {
    title: 'Jog Falls & Murudeshwar Package',
    description: 'Explore the majestic Jog Falls and the spiritual Murudeshwar Beach.',
    destination: 'Murudeshwar',
    state: 'Karnataka',
    price: 8499,
    duration: { days: 3, nights: 2 },
    category: 'Pilgrimage',
    highlights: ['Jog Falls', 'Murudeshwar', 'Murudeshwar Beach', 'Shiva Statue'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/jog_falls_hero.jpg']
  },
  {
    title: 'Belur Halebidu Heritage Tour',
    description: 'Discover the ancient Hoysala architecture and heritage of Belur and Halebidu.',
    destination: 'Belur',
    state: 'Karnataka',
    price: 4999,
    duration: { days: 2, nights: 1 },
    category: 'Cultural',
    highlights: ['Belur', 'Halebidu', 'Ancient Hoysala Temples'],
    inclusions: ['Guide', 'Stay', 'Food', 'Travel'],
    hotel: { type: 'Standard' },
    images: ['/assets/belur_hero.jpg']
  },
  {
    title: 'Badami Pattadakal Aihole Package',
    description: 'A deep dive into the Chalukya dynasty\'s architectural marvels.',
    destination: 'Badami',
    state: 'Karnataka',
    price: 7499,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['Badami Cave Temples', 'Pattadakal', 'Aihole'],
    inclusions: ['Transportation', 'Hotel Stay', 'Food', 'Certified Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/badami_hero.jpg']
  },
  {
    title: 'Kabini Wildlife Safari Package',
    description: 'Thrilling wildlife encounters in the renowned Kabini forest.',
    destination: 'Kabini',
    state: 'Karnataka',
    price: 8999,
    duration: { days: 2, nights: 1 },
    category: 'Wildlife',
    highlights: ['Kabini', 'Wildlife Safari', 'Boat Safari'],
    inclusions: ['Jungle Safari', 'Resort Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/nagarhole.jpg']
  },
  {
    title: 'Bandipur Nature Package',
    description: 'Explore the dense forests and spot incredible wildlife in Bandipur.',
    destination: 'Bandipur',
    state: 'Karnataka',
    price: 6999,
    duration: { days: 2, nights: 1 },
    category: 'Wildlife',
    highlights: ['Bandipur National Park', 'Safari', 'Forest Resort'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/bandipur_hero.jpg']
  },
  {
    title: 'Sakleshpur Green Escape',
    description: 'A serene getaway to the coffee plantations of Sakleshpur.',
    destination: 'Sakleshpur',
    state: 'Karnataka',
    price: 5499,
    duration: { days: 2, nights: 1 },
    category: 'Hill Station',
    highlights: ['Sakleshpur', 'Railway Bridge View', 'Coffee Plantations', 'Manjarabad Fort'],
    inclusions: ['Travel', 'Resort Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/sakaleshpura_hero.jpg']
  },
  {
    title: 'Kemmanagundi Hill Station Tour',
    description: 'Enjoy the pleasant weather and beautiful waterfalls of Kemmanagundi.',
    destination: 'Kemmanagundi',
    state: 'Karnataka',
    price: 5999,
    duration: { days: 2, nights: 1 },
    category: 'Hill Station',
    highlights: ['Kemmanagundi', 'Hebbe Falls', 'Z Point', 'Rose Garden'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/kemmanagundi_zpoint_hero.jpg']
  },
  {
    title: 'Udupi & Maravanthe Beach Package',
    description: 'Experience the unique beauty of coastal Karnataka and its famous temples.',
    destination: 'Udupi',
    state: 'Karnataka',
    price: 8999,
    duration: { days: 3, nights: 2 },
    category: 'Beach',
    highlights: ['Udupi', 'Maravanthe Beach', 'St. Mary\'s Island', 'Krishna Temple'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/udupi_hero.jpg']
  },
  {
    title: 'Agumbe Rainforest Package',
    description: 'Immerse yourself in the dense rainforests and breathtaking sunsets of Agumbe.',
    destination: 'Agumbe',
    state: 'Karnataka',
    price: 5499,
    duration: { days: 2, nights: 1 },
    category: 'Adventure',
    highlights: ['Agumbe', 'Sunset Point', 'Rainforest Trek', 'Waterfalls'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/jog_falls_hero.jpg']
  },
  {
    title: 'Premium Karnataka Grand Tour',
    description: 'The ultimate luxury tour covering the best of Karnataka.',
    destination: 'Multiple Destinations',
    state: 'Karnataka',
    price: 24999,
    duration: { days: 10, nights: 9 },
    category: 'Family',
    featured: true,
    highlights: ['Bengaluru', 'Mysore', 'Coorg', 'Chikmagalur', 'Hampi', 'Dandeli', 'Gokarna', 'Murudeshwar', 'Udupi'],
    inclusions: ['Luxury AC Bus / Cab', '3-Star & 4-Star Hotels', 'Breakfast, Lunch & Dinner', 'Professional Tour Guide', 'Entry Tickets', 'Travel Insurance', '24/7 Customer Support'],
    hotel: { type: 'Luxury' },
    images: ['/assets/mysore_hero_banner_1780120587644.png']
  },
  {
    title: 'KRS Dam & Brindavan Gardens Package',
    description: 'A quick getaway to witness the musical fountains and scenic gardens.',
    destination: 'Mysore',
    state: 'Karnataka',
    price: 1999,
    duration: { days: 1, nights: 0 },
    category: 'Family',
    highlights: ['Krishna Raja Sagara', 'Brindavan Gardens', 'Musical Fountain'],
    inclusions: ['Travel', 'Breakfast & Lunch', 'Guide'],
    hotel: { type: 'Budget' },
    images: ['/assets/krs_dam_hero.jpg']
  },
  {
    title: 'Biligiri Rangan Hills Wildlife Tour',
    description: 'Discover the unique ecosystem where the Eastern and Western Ghats meet.',
    destination: 'BR Hills',
    state: 'Karnataka',
    price: 6499,
    duration: { days: 2, nights: 1 },
    category: 'Wildlife',
    highlights: ['Biligiriranga Hills', 'Wildlife Safari', 'Nature Trails'],
    inclusions: ['Travel', 'Resort Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/bandipur_hero.jpg']
  },
  {
    title: 'Karwar Beach Package',
    description: 'Relax on the serene beaches and explore the islands of Karwar.',
    destination: 'Karwar',
    state: 'Karnataka',
    price: 8499,
    duration: { days: 3, nights: 2 },
    category: 'Beach',
    highlights: ['Karwar', 'Rabindranath Tagore Beach', 'Devbagh Beach', 'Island Boat Ride'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/kudle_beach.jpg']
  },
  {
    title: 'Shivagange Adventure Tour',
    description: 'A thrilling one-day trek to the rocky peak of Shivagange.',
    destination: 'Shivagange',
    state: 'Karnataka',
    price: 1599,
    duration: { days: 1, nights: 0 },
    category: 'Adventure',
    highlights: ['Shivagange', 'Hill Trek', 'Temple Visit'],
    inclusions: ['Travel', 'Guide', 'Breakfast'],
    hotel: { type: 'Budget' },
    images: ['/assets/nandi_hills_hero.jpg']
  },
  {
    title: 'Yana Caves & Gokarna Package',
    description: 'Explore the unique limestone formations and relax on the beaches of Gokarna.',
    destination: 'Gokarna',
    state: 'Karnataka',
    price: 5999,
    duration: { days: 2, nights: 1 },
    category: 'Beach',
    highlights: ['Yana', 'Gokarna', 'Om Beach'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/yana.png']
  },
  {
    title: 'Kodachadri Trek Package',
    description: 'Trek through lush green hills and spot magnificent waterfalls.',
    destination: 'Kodachadri',
    state: 'Karnataka',
    price: 5499,
    duration: { days: 2, nights: 1 },
    category: 'Adventure',
    highlights: ['Kodachadri', 'Hidlumane Falls', 'Sunset Point'],
    inclusions: ['Trek Guide', 'Travel', 'Food', 'Stay'],
    hotel: { type: 'Standard' },
    images: ['/assets/kodachadri_hero.jpg']
  },
  {
    title: 'Horanadu & Sringeri Spiritual Tour',
    description: 'A peaceful spiritual journey to the famous temples nestled in the Ghats.',
    destination: 'Sringeri',
    state: 'Karnataka',
    price: 4999,
    duration: { days: 2, nights: 1 },
    category: 'Pilgrimage',
    highlights: ['Horanadu Annapoorneshwari Temple', 'Sringeri'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/sringeri_hero.jpg']
  },
  {
    title: 'Dharmasthala & Kukke Subramanya Package',
    description: 'Seek blessings at the renowned pilgrimage sites of Dakshina Kannada.',
    destination: 'Dharmasthala',
    state: 'Karnataka',
    price: 4999,
    duration: { days: 2, nights: 1 },
    category: 'Pilgrimage',
    highlights: ['Dharmasthala', 'Kukke Subramanya'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/dharmasthala.jpg']
  },
  {
    title: 'Nagarhole Wildlife Safari Package',
    description: 'Spot diverse wildlife in their natural habitat in Nagarhole.',
    destination: 'Nagarhole',
    state: 'Karnataka',
    price: 7499,
    duration: { days: 2, nights: 1 },
    category: 'Wildlife',
    highlights: ['Nagarhole National Park', 'Jungle Safari', 'Bird Watching'],
    inclusions: ['Safari', 'Resort Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/nagarhole.jpg']
  },
  {
    title: 'Chitradurga Fort Heritage Tour',
    description: 'Explore the fascinating history and massive stonewalls of Chitradurga Fort.',
    destination: 'Chitradurga',
    state: 'Karnataka',
    price: 1899,
    duration: { days: 1, nights: 0 },
    category: 'Cultural',
    highlights: ['Chitradurga Fort', 'Historic Fort Exploration'],
    inclusions: ['Travel', 'Food', 'Guide'],
    hotel: { type: 'Budget' },
    images: ['/assets/chitradurga.png']
  },
  {
    title: 'Savanadurga Trek Package',
    description: 'Trek the largest monolith hill in Asia for a stunning sunrise.',
    destination: 'Savandurga',
    state: 'Karnataka',
    price: 1499,
    duration: { days: 1, nights: 0 },
    category: 'Adventure',
    highlights: ['Savandurga', 'Trekking', 'Sunrise View'],
    inclusions: ['Travel', 'Breakfast', 'Trek Guide'],
    hotel: { type: 'Budget' },
    images: ['/assets/savanadurga_v3.png']
  },
  {
    title: 'Bheemeshwari Adventure Package',
    description: 'Enjoy thrilling river activities and nature camps near the Cauvery river.',
    destination: 'Bheemeshwari',
    state: 'Karnataka',
    price: 5999,
    duration: { days: 2, nights: 1 },
    category: 'Adventure',
    highlights: ['Bheemeshwari', 'River Activities', 'Nature Camp'],
    inclusions: ['Resort Stay', 'Adventure Activities', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/bheemeshwari_hero.jpg']
  },
  {
    title: 'Talakaveri & Madikeri Package',
    description: 'Visit the origin of river Cauvery and the beautiful hill station of Madikeri.',
    destination: 'Madikeri',
    state: 'Karnataka',
    price: 5499,
    duration: { days: 2, nights: 1 },
    category: 'Hill Station',
    highlights: ['Talakaveri', 'Madikeri', 'Raja\'s Seat'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/madikeri_hero.jpg']
  },
  {
    title: 'Udupi Temple & Beach Tour',
    description: 'A perfect blend of spirituality and beach relaxation in Udupi.',
    destination: 'Udupi',
    state: 'Karnataka',
    price: 5999,
    duration: { days: 2, nights: 1 },
    category: 'Beach',
    highlights: ['Udupi Krishna Temple', 'Malpe Beach', 'St. Mary\'s Island'],
    inclusions: ['Travel', 'Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/udupi_temple_beach.jpg']
  },
  {
    title: 'Kudle Beach & Paradise Beach Package',
    description: 'Experience the pristine beauty of Gokarna\'s best beaches.',
    destination: 'Gokarna',
    state: 'Karnataka',
    price: 5499,
    duration: { days: 2, nights: 1 },
    category: 'Beach',
    highlights: ['Kudle Beach', 'Paradise Beach', 'Gokarna'],
    inclusions: ['Travel', 'Beach Stay', 'Food', 'Guide'],
    hotel: { type: 'Standard' },
    images: ['/assets/kudle_beach.jpg']
  }
];

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing packages before seeding to avoid duplicates
    try {
      // await Package.deleteMany({});
      // console.log('Cleared existing packages');
      
      const inserted = await Package.insertMany(packages);
      console.log(`Successfully seeded ${inserted.length} packages`);
    } catch (err) {
      console.error('Error inserting packages:', err);
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });
