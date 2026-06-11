const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const Package = require('../models/Package');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';

const packages = [
  // GOA
  {
    title: 'North Goa Beach Explorer',
    description: 'Discover the vibrant nightlife, pristine beaches, and historical forts of North Goa. Perfect for beach lovers and party enthusiasts.',
    destination: 'North Goa',
    state: 'Goa',
    price: 12999,
    duration: { days: 4, nights: 3 },
    category: 'Beach',
    highlights: ['Baga Beach', 'Aguada Fort', 'Anjuna Flea Market', 'Dolphin Sightseeing'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Lunch, Dinner', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Standard', name: 'Goa Beach Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Coach for local travel' },
    images: ['https://image.pollinations.ai/prompt/Popular%20Goa%20beaches%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.5,
    reviewCount: 120,
    itinerary: [
      { day: 1, title: 'Arrival & Beach Walk', description: 'Arrive in Goa, check in to your resort, and relax at Baga beach.', activities: ['Check-in', 'Beach Walk'] },
      { day: 2, title: 'North Goa Tour', description: 'Visit Aguada Fort and Calangute Beach.', activities: ['Fort Visit', 'Water Sports'] },
      { day: 3, title: 'Anjuna & Vagator', description: 'Explore Anjuna flea market and watch the sunset at Vagator.', activities: ['Shopping', 'Sunset View'] },
      { day: 4, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'South Goa Luxury Escape',
    description: 'Experience tranquility and luxury at the pristine beaches of South Goa. Enjoy private beach access and 5-star hospitality.',
    destination: 'South Goa',
    state: 'Goa',
    price: 35000,
    duration: { days: 5, nights: 4 },
    category: 'Luxury',
    highlights: ['Palolem Beach', 'Colva Beach', 'Dudhsagar Waterfalls (Optional)', 'Luxury Spa'],
    inclusions: ['AC Travel', 'Luxury Hotel Accommodation', 'Breakfast, Lunch, Dinner', 'Airport Pickup and Drop'],
    hotel: { type: 'Luxury', name: 'Taj Exotica Resort & Spa', rating: 5 },
    transport: { type: 'Flight', details: 'Includes economy flight and private cab' },
    images: ['https://image.pollinations.ai/prompt/Luxury%20beach%20resorts%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'November to February',
    rating: 4.8,
    reviewCount: 85,
    itinerary: [
      { day: 1, title: 'Welcome to Luxury', description: 'Arrive and check in to the 5-star property.', activities: ['Welcome Drink', 'Spa Session'] },
      { day: 2, title: 'Palolem Beach', description: 'Relax at the beautiful Palolem beach.', activities: ['Beach Relaxation'] },
      { day: 3, title: 'Dudhsagar Excursion', description: 'Optional trip to Dudhsagar waterfalls.', activities: ['Sightseeing'] },
      { day: 4, title: 'Colva Exploration', description: 'Visit Colva and local churches.', activities: ['Heritage Walk'] },
      { day: 5, title: 'Departure', description: 'Private transfer to airport.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Goa Water Sports Package',
    description: 'Get your adrenaline pumping with thrilling water sports across Goa\'s best beaches.',
    destination: 'Goa',
    state: 'Goa',
    price: 18999,
    duration: { days: 3, nights: 2 },
    category: 'Adventure',
    highlights: ['Scuba Diving', 'Parasailing', 'Jet Ski', 'Banana Boat Ride'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Local Sightseeing', 'Water Sports Passes'],
    hotel: { type: 'Standard', name: 'Adventure Inn', rating: 3 },
    transport: { type: 'Mixed', details: 'Local AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Parasailing%20and%20water%20sports%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to May',
    rating: 4.6,
    reviewCount: 200,
    itinerary: [
      { day: 1, title: 'Arrival & Jet Ski', description: 'Arrive and head straight for jet skiing at Calangute.', activities: ['Jet Ski'] },
      { day: 2, title: 'Scuba Diving', description: 'Full day scuba diving at Grand Island.', activities: ['Scuba Diving', 'Boat Ride'] },
      { day: 3, title: 'Parasailing & Departure', description: 'Morning parasailing before departure.', activities: ['Parasailing'] }
    ]
  },
  // KERALA
  {
    title: 'Munnar Tea Garden Tour',
    description: 'Immerse yourself in the lush green tea estates and misty hills of Munnar.',
    destination: 'Munnar',
    state: 'Kerala',
    price: 14500,
    duration: { days: 4, nights: 3 },
    category: 'Hill Station',
    highlights: ['Tea Museum', 'Eravikulam National Park', 'Mattupetty Dam', 'Echo Point'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing', 'Tour Guide'],
    hotel: { type: 'Premium', name: 'Munnar Tea Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab from Kochi' },
    images: ['https://image.pollinations.ai/prompt/Tea%20plantations%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'September to March',
    rating: 4.7,
    reviewCount: 340,
    itinerary: [
      { day: 1, title: 'Journey to Munnar', description: 'Drive from Kochi to Munnar, enjoying waterfalls on the way.', activities: ['Scenic Drive', 'Check-in'] },
      { day: 2, title: 'Tea Estates & Museum', description: 'Visit the Tea Museum and extensive tea gardens.', activities: ['Tea Tasting', 'Museum Visit'] },
      { day: 3, title: 'Eravikulam & Mattupetty', description: 'Spot the Nilgiri Tahr and visit the dam.', activities: ['Wildlife', 'Boating'] },
      { day: 4, title: 'Departure', description: 'Drive back to Kochi.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Alleppey Houseboat Experience',
    description: 'A romantic and peaceful overnight stay in a traditional Kerala houseboat cruising the backwaters.',
    destination: 'Alleppey',
    state: 'Kerala',
    price: 11999,
    duration: { days: 2, nights: 1 },
    category: 'Honeymoon',
    highlights: ['Backwater Cruise', 'Traditional Houseboat', 'Authentic Kerala Cuisine'],
    inclusions: ['AC Travel', 'Houseboat Stay', 'Breakfast, Lunch, Dinner', 'Guide'],
    hotel: { type: 'Premium', name: 'Luxury Houseboat', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Houseboats%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to February',
    rating: 4.9,
    reviewCount: 512,
    itinerary: [
      { day: 1, title: 'Board the Houseboat', description: 'Check-in at noon and start the cruise through Vembanad Lake.', activities: ['Cruising', 'Sunset View'] },
      { day: 2, title: 'Morning Cruise & Checkout', description: 'Enjoy breakfast on board and check out at 9 AM.', activities: ['Morning Cruise'] }
    ]
  },
  {
    title: 'Wayanad Nature Escape',
    description: 'Explore the unspoiled nature, caves, and waterfalls of Wayanad.',
    destination: 'Wayanad',
    state: 'Kerala',
    price: 13500,
    duration: { days: 3, nights: 2 },
    category: 'Adventure',
    highlights: ['Edakkal Caves', 'Soochipara Waterfalls', 'Banasura Sagar Dam'],
    inclusions: ['AC Travel', 'Resort Stay', 'Breakfast, Lunch, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Standard', name: 'Wayanad Jungle Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Forests%20and%20waterfalls%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to May',
    rating: 4.5,
    reviewCount: 150,
    itinerary: [
      { day: 1, title: 'Arrival in Wayanad', description: 'Check in and visit Banasura Sagar Dam.', activities: ['Boating'] },
      { day: 2, title: 'Caves and Waterfalls', description: 'Trek to Edakkal Caves and relax at Soochipara.', activities: ['Trekking', 'Waterfall'] },
      { day: 3, title: 'Departure', description: 'Checkout and departure.', activities: ['Shopping'] }
    ]
  },
  {
    title: 'Kerala Backwater Luxury Tour',
    description: 'A lavish multi-day tour of Kerala\'s best backwater resorts and spas.',
    destination: 'Kumarakom',
    state: 'Kerala',
    price: 45000,
    duration: { days: 5, nights: 4 },
    category: 'Luxury',
    highlights: ['Kumarakom Bird Sanctuary', 'Ayurvedic Spa', 'Private Boat Cruise'],
    inclusions: ['AC Travel', 'Luxury Resort Accommodation', 'Breakfast, Lunch, Dinner', 'Spa Session'],
    hotel: { type: 'Luxury', name: 'Kumarakom Lake Resort', rating: 5 },
    transport: { type: 'Flight', details: 'Includes local luxury transfers' },
    images: ['https://image.pollinations.ai/prompt/Kerala%20backwaters%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'September to March',
    rating: 4.8,
    reviewCount: 92,
    itinerary: [
      { day: 1, title: 'Arrival in Kumarakom', description: 'Welcome to the luxury resort.', activities: ['Check-in', 'Leisure'] },
      { day: 2, title: 'Bird Sanctuary & Spa', description: 'Morning bird watching and afternoon Ayurvedic spa.', activities: ['Bird Watching', 'Spa'] },
      { day: 3, title: 'Private Cruise', description: 'Full day private backwater cruise with meals onboard.', activities: ['Cruising'] },
      { day: 4, title: 'Village Tour', description: 'Explore local village life and cuisines.', activities: ['Cultural Walk'] },
      { day: 5, title: 'Departure', description: 'Luxury transfer to the airport.', activities: ['Checkout'] }
    ]
  },
  // TAMIL NADU
  {
    title: 'Ooty Hill Station Tour',
    description: 'Enjoy the Queen of Hill Stations with its botanical gardens and toy train.',
    destination: 'Ooty',
    state: 'Tamil Nadu',
    price: 12500,
    duration: { days: 3, nights: 2 },
    category: 'Hill Station',
    highlights: ['Ooty Lake', 'Botanical Gardens', 'Nilgiri Mountain Railway', 'Doddabetta Peak'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Standard', name: 'Ooty Heritage Hotel', rating: 3 },
    transport: { type: 'Mixed', details: 'Includes toy train ticket' },
    images: ['https://image.pollinations.ai/prompt/Tea%20gardens%20and%20hills%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'March to June',
    rating: 4.6,
    reviewCount: 220,
    itinerary: [
      { day: 1, title: 'Arrival & Lake', description: 'Check-in and evening boating at Ooty Lake.', activities: ['Boating'] },
      { day: 2, title: 'Sightseeing & Toy Train', description: 'Visit Doddabetta, Gardens and take a ride on the Toy Train.', activities: ['Train Ride', 'Sightseeing'] },
      { day: 3, title: 'Departure', description: 'Morning shopping and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Kodaikanal Family Package',
    description: 'A perfect family getaway to the Princess of Hill Stations.',
    destination: 'Kodaikanal',
    state: 'Tamil Nadu',
    price: 16999,
    duration: { days: 4, nights: 3 },
    category: 'Family',
    highlights: ['Kodai Lake', 'Coaker\'s Walk', 'Pillar Rocks', 'Silver Cascade Falls'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Lunch, Dinner', 'Local Sightseeing', 'Guide'],
    hotel: { type: 'Premium', name: 'Kodai Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Innova for Family' },
    images: ['https://image.pollinations.ai/prompt/Kodaikanal%20lake%20and%20hills%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'April to June',
    rating: 4.5,
    reviewCount: 180,
    itinerary: [
      { day: 1, title: 'Arrival & Walk', description: 'Check-in and evening walk at Coaker\'s Walk.', activities: ['Leisure Walk'] },
      { day: 2, title: 'Lake & Pillars', description: 'Boating at Kodai Lake and visit to Pillar Rocks.', activities: ['Boating', 'Sightseeing'] },
      { day: 3, title: 'Waterfalls & Pine Forest', description: 'Visit Pine Forest and Silver Cascade Falls.', activities: ['Nature Tour'] },
      { day: 4, title: 'Departure', description: 'Checkout and onward journey.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Rameshwaram Pilgrimage Tour',
    description: 'A deeply spiritual journey to the sacred island of Rameshwaram.',
    destination: 'Rameshwaram',
    state: 'Tamil Nadu',
    price: 9999,
    duration: { days: 2, nights: 1 },
    category: 'Pilgrimage',
    highlights: ['Ramanathaswamy Temple', 'Agniteertham', 'Dhanushkodi', 'Pamban Bridge'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Temple VIP Darshan'],
    hotel: { type: 'Budget', name: 'Temple View Inn', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Coach' },
    images: ['https://image.pollinations.ai/prompt/Ramanathaswamy%20Temple%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to April',
    rating: 4.8,
    reviewCount: 450,
    itinerary: [
      { day: 1, title: 'Arrival & Darshan', description: 'Cross the Pamban Bridge and evening temple darshan.', activities: ['Darshan'] },
      { day: 2, title: 'Dhanushkodi & Departure', description: 'Morning visit to Dhanushkodi and departure.', activities: ['Sightseeing', 'Checkout'] }
    ]
  },
  {
    title: 'Madurai Temple Heritage Tour',
    description: 'Experience the grandeur of the Meenakshi Amman Temple and Madurai\'s rich heritage.',
    destination: 'Madurai',
    state: 'Tamil Nadu',
    price: 11500,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['Meenakshi Temple', 'Thirumalai Nayakkar Palace', 'Gandhi Museum'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Standard', name: 'Madurai Heritage', rating: 3 },
    transport: { type: 'Mixed', details: 'Local AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Meenakshi%20Temple%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    reviewCount: 310,
    itinerary: [
      { day: 1, title: 'Arrival & Evening Aarti', description: 'Check-in and witness the evening Aarti at the temple.', activities: ['Temple Visit'] },
      { day: 2, title: 'Heritage Walk', description: 'Visit the Palace, Museum and explore local markets.', activities: ['Sightseeing', 'Shopping'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  // ANDHRA PRADESH
  {
    title: 'Araku Valley Tour',
    description: 'A scenic journey through the Eastern Ghats to the beautiful Araku Valley.',
    destination: 'Araku Valley',
    state: 'Andhra Pradesh',
    price: 8999,
    duration: { days: 2, nights: 1 },
    category: 'Hill Station',
    highlights: ['Borra Caves', 'Coffee Plantations', 'Tribal Museum', 'Katiki Waterfalls'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Lunch, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Standard', name: 'Araku Haritha Resort', rating: 3 },
    transport: { type: 'Train', details: 'Vistadome Train Ride included' },
    images: ['https://image.pollinations.ai/prompt/Araku%20landscapes%20and%20coffee%20plantations%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'September to February',
    rating: 4.6,
    reviewCount: 205,
    itinerary: [
      { day: 1, title: 'Vistadome Ride & Borra Caves', description: 'Scenic train journey and visit to the limestone caves.', activities: ['Train Ride', 'Cave Exploration'] },
      { day: 2, title: 'Museum & Waterfalls', description: 'Visit the Tribal Museum and Katiki Waterfalls.', activities: ['Sightseeing', 'Checkout'] }
    ]
  },
  {
    title: 'Tirupati Spiritual Package',
    description: 'Seek blessings at the world-famous Lord Venkateswara Temple in Tirumala.',
    destination: 'Tirupati',
    state: 'Andhra Pradesh',
    price: 6500,
    duration: { days: 2, nights: 1 },
    category: 'Pilgrimage',
    highlights: ['Tirumala Temple Darshan', 'Padmavathi Temple', 'Kapila Theertham'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'VIP Darshan Tickets'],
    hotel: { type: 'Standard', name: 'Pilgrim Residency', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab for local transit' },
    images: ['https://image.pollinations.ai/prompt/Tirumala%20Temple%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'September to February',
    rating: 4.9,
    reviewCount: 890,
    itinerary: [
      { day: 1, title: 'Arrival & Padmavathi Temple', description: 'Check-in and visit Sri Padmavathi Ammavari Temple.', activities: ['Temple Visit'] },
      { day: 2, title: 'Tirumala Darshan & Departure', description: 'Morning VIP Darshan at Tirumala and departure.', activities: ['VIP Darshan', 'Checkout'] }
    ]
  },
  // TELANGANA
  {
    title: 'Hyderabad Heritage Tour',
    description: 'Explore the City of Pearls, its historic monuments, and rich culinary heritage.',
    destination: 'Hyderabad',
    state: 'Telangana',
    price: 13500,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['Charminar', 'Golconda Fort', 'Salar Jung Museum', 'Hussain Sagar Lake'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Premium', name: 'Hyderabad Grand', rating: 4 },
    transport: { type: 'Mixed', details: 'Local AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Charminar%20and%20heritage%20sites%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.5,
    reviewCount: 300,
    itinerary: [
      { day: 1, title: 'Charminar & Museum', description: 'Visit Charminar, Mecca Masjid, and Salar Jung Museum.', activities: ['Heritage Walk', 'Shopping'] },
      { day: 2, title: 'Golconda & Lake', description: 'Explore Golconda Fort and evening boat ride at Hussain Sagar.', activities: ['Sightseeing', 'Boating'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Ramoji Film City Package',
    description: 'Step into the magic of cinema at the world\'s largest film studio complex.',
    destination: 'Hyderabad',
    state: 'Telangana',
    price: 9999,
    duration: { days: 2, nights: 1 },
    category: 'Family',
    highlights: ['Ramoji Film City Tour', 'Live Shows', 'Theme Park Rides'],
    inclusions: ['AC Travel', 'Hotel Accommodation inside Film City', 'Breakfast, Dinner', 'Film City Entry Tickets'],
    hotel: { type: 'Premium', name: 'Sitara Luxury Hotel', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Coach' },
    images: ['https://image.pollinations.ai/prompt/Ramoji%20Film%20City%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'Year-round',
    rating: 4.7,
    reviewCount: 420,
    itinerary: [
      { day: 1, title: 'Studio Tour', description: 'Check-in and take the guided studio tour.', activities: ['Studio Tour', 'Live Shows'] },
      { day: 2, title: 'Theme Park & Departure', description: 'Enjoy the rides and attractions before departure.', activities: ['Theme Park', 'Checkout'] }
    ]
  },
  // MAHARASHTRA
  {
    title: 'Mahabaleshwar Retreat',
    description: 'A refreshing escape to the strawberry capital of India.',
    destination: 'Mahabaleshwar',
    state: 'Maharashtra',
    price: 11000,
    duration: { days: 3, nights: 2 },
    category: 'Hill Station',
    highlights: ['Venna Lake', 'Pratapgad Fort', 'Mapro Garden', 'Elephant\'s Head Point'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Standard', name: 'Strawberry Hill Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab from Pune/Mumbai' },
    images: ['https://image.pollinations.ai/prompt/Hills%20and%20strawberry%20farms%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to June',
    rating: 4.6,
    reviewCount: 280,
    itinerary: [
      { day: 1, title: 'Arrival & Lake', description: 'Check-in and enjoy boating at Venna Lake.', activities: ['Boating'] },
      { day: 2, title: 'Fort & Viewpoints', description: 'Visit Pratapgad Fort and famous viewpoints.', activities: ['Sightseeing'] },
      { day: 3, title: 'Mapro Garden & Departure', description: 'Visit Mapro Garden, taste strawberries, and depart.', activities: ['Shopping', 'Checkout'] }
    ]
  },
  {
    title: 'Lonavala Weekend Tour',
    description: 'A quick and rejuvenating weekend getaway to Lonavala and Khandala.',
    destination: 'Lonavala',
    state: 'Maharashtra',
    price: 7999,
    duration: { days: 2, nights: 1 },
    category: 'Adventure',
    highlights: ['Tiger\'s Leap', 'Bhushi Dam', 'Karla Caves', 'Rajmachi Point'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Local Sightseeing'],
    hotel: { type: 'Standard', name: 'Lonavala Retreat', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Green%20valleys%20and%20waterfalls%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'July to March',
    rating: 4.4,
    reviewCount: 350,
    itinerary: [
      { day: 1, title: 'Arrival & Points', description: 'Visit Tiger\'s Leap and Rajmachi Point.', activities: ['Sightseeing'] },
      { day: 2, title: 'Caves & Dam', description: 'Explore Karla Caves and visit Bhushi Dam before departure.', activities: ['Trekking', 'Checkout'] }
    ]
  },
  {
    title: 'Mumbai City Explorer',
    description: 'Experience the fast-paced life, heritage, and glamour of Mumbai.',
    destination: 'Mumbai',
    state: 'Maharashtra',
    price: 15500,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Juhu Beach'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Ferry Tickets'],
    hotel: { type: 'Premium', name: 'Marine View Hotel', rating: 4 },
    transport: { type: 'Mixed', details: 'Local AC Cab' },
    images: ['/assets/mumbai.jpg'],
    bestTimeToVisit: 'October to February',
    rating: 4.7,
    reviewCount: 500,
    itinerary: [
      { day: 1, title: 'South Mumbai Tour', description: 'Visit Gateway of India, Colaba, and Marine Drive.', activities: ['Heritage Walk'] },
      { day: 2, title: 'Elephanta & Juhu', description: 'Morning ferry to Elephanta Caves and evening at Juhu Beach.', activities: ['Cave Tour', 'Beach Visit'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Ajanta Ellora Heritage Tour',
    description: 'Discover the ancient rock-cut caves and magnificent monolithic structures of Aurangabad.',
    destination: 'Aurangabad',
    state: 'Maharashtra',
    price: 16999,
    duration: { days: 4, nights: 3 },
    category: 'Cultural',
    highlights: ['Ajanta Caves', 'Ellora Caves', 'Bibi Ka Maqbara', 'Daulatabad Fort'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Standard', name: 'Heritage Inn Aurangabad', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Ajanta%20and%20Ellora%20caves%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.8,
    reviewCount: 410,
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive in Aurangabad and relax.', activities: ['Check-in'] },
      { day: 2, title: 'Ajanta Caves', description: 'Full day excursion to the ancient Ajanta Caves.', activities: ['Cave Tour'] },
      { day: 3, title: 'Ellora & Fort', description: 'Visit Ellora Caves and Daulatabad Fort.', activities: ['Sightseeing'] },
      { day: 4, title: 'Departure', description: 'Visit Bibi Ka Maqbara and depart.', activities: ['Checkout'] }
    ]
  },
  // RAJASTHAN
  {
    title: 'Jaipur Royal Heritage Tour',
    description: 'Experience the regal charm, massive forts, and vibrant markets of the Pink City.',
    destination: 'Jaipur',
    state: 'Rajasthan',
    price: 14500,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['Amer Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'],
    inclusions: ['AC Travel', 'Heritage Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Premium', name: 'Jaipur Heritage Haveli', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Palaces%20and%20forts%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    reviewCount: 650,
    itinerary: [
      { day: 1, title: 'City Tour', description: 'Visit City Palace and Hawa Mahal.', activities: ['Sightseeing'] },
      { day: 2, title: 'Amer Fort & Observatory', description: 'Elephant ride at Amer Fort and visit Jantar Mantar.', activities: ['Fort Tour'] },
      { day: 3, title: 'Departure', description: 'Shopping at Johari Bazaar and departure.', activities: ['Shopping', 'Checkout'] }
    ]
  },
  {
    title: 'Udaipur Lake City Package',
    description: 'A romantic getaway to the City of Lakes, filled with palaces and boat rides.',
    destination: 'Udaipur',
    state: 'Rajasthan',
    price: 16500,
    duration: { days: 3, nights: 2 },
    category: 'Honeymoon',
    highlights: ['City Palace', 'Lake Pichola Boat Ride', 'Jag Mandir', 'Saheliyon Ki Bari'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Boat Ride Tickets'],
    hotel: { type: 'Premium', name: 'Udaipur Lake View Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Lakes%20and%20palaces%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'September to March',
    rating: 4.9,
    reviewCount: 420,
    itinerary: [
      { day: 1, title: 'Arrival & Boat Ride', description: 'Check-in and evening boat ride on Lake Pichola.', activities: ['Boating'] },
      { day: 2, title: 'Palaces & Gardens', description: 'Visit City Palace, Jag Mandir, and Saheliyon Ki Bari.', activities: ['Sightseeing'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Jaisalmer Desert Safari',
    description: 'Experience the golden sands of the Thar Desert with camel rides and cultural nights.',
    destination: 'Jaisalmer',
    state: 'Rajasthan',
    price: 13999,
    duration: { days: 3, nights: 2 },
    category: 'Adventure',
    highlights: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Camel Safari', 'Cultural Program'],
    inclusions: ['AC Travel', 'Desert Camp Stay', 'Breakfast, Dinner', 'Safari Tickets', 'Guide'],
    hotel: { type: 'Standard', name: 'Desert Camp Resorts', rating: 3 },
    transport: { type: 'Mixed', details: 'Jeep Safari included' },
    images: ['https://image.pollinations.ai/prompt/Camel%20safari%20and%20desert%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'November to March',
    rating: 4.8,
    reviewCount: 380,
    itinerary: [
      { day: 1, title: 'Golden Fort', description: 'Visit the living Jaisalmer Fort and Patwon Ki Haveli.', activities: ['Heritage Walk'] },
      { day: 2, title: 'Desert Safari', description: 'Move to the desert camp, enjoy camel safari, and cultural night.', activities: ['Camel Safari', 'Cultural Show'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast at the camp and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Rajasthan Luxury Tour',
    description: 'A grand tour covering the finest luxury heritage hotels of Jaipur, Jodhpur, and Udaipur.',
    destination: 'Multiple Destinations',
    state: 'Rajasthan',
    price: 65000,
    duration: { days: 7, nights: 6 },
    category: 'Luxury',
    highlights: ['Taj Rambagh Palace', 'Umaid Bhawan Palace', 'Taj Lake Palace', 'Exclusive Tours'],
    inclusions: ['AC Travel', 'Luxury Hotel Accommodation', 'Breakfast, Lunch, Dinner', 'Private Guide', 'Premium Transfers'],
    hotel: { type: 'Luxury', name: 'Taj Heritage Hotels', rating: 5 },
    transport: { type: 'Flight', details: 'Private AC SUV for intercity travel' },
    images: ['https://image.pollinations.ai/prompt/Luxury%20palaces%20and%20forts%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.9,
    reviewCount: 150,
    itinerary: [
      { day: 1, title: 'Arrive in Jaipur', description: 'Royal welcome at the palace hotel.', activities: ['Leisure'] },
      { day: 2, title: 'Jaipur Sightseeing', description: 'Private tour of Amer Fort and City Palace.', activities: ['Sightseeing'] },
      { day: 3, title: 'Travel to Jodhpur', description: 'Drive to Jodhpur and check in to Umaid Bhawan.', activities: ['Travel', 'Leisure'] },
      { day: 4, title: 'Jodhpur Tour', description: 'Visit Mehrangarh Fort and Jaswant Thada.', activities: ['Fort Tour'] },
      { day: 5, title: 'Travel to Udaipur', description: 'Drive to Udaipur, check in to Lake Palace.', activities: ['Travel', 'Boating'] },
      { day: 6, title: 'Udaipur Royalty', description: 'Private boat cruise and palace tour.', activities: ['Sightseeing'] },
      { day: 7, title: 'Departure', description: 'Luxury transfer to the airport.', activities: ['Checkout'] }
    ]
  },
  // HIMACHAL PRADESH
  {
    title: 'Manali Adventure Tour',
    description: 'Thrilling snow adventures, beautiful valleys, and cozy cafes in Manali.',
    destination: 'Manali',
    state: 'Himachal Pradesh',
    price: 15999,
    duration: { days: 4, nights: 3 },
    category: 'Adventure',
    highlights: ['Solang Valley', 'Rohtang Pass (Subject to permit)', 'Hadimba Temple', 'River Rafting'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Adventure Activity Passes', 'Guide'],
    hotel: { type: 'Standard', name: 'Snow View Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab from Delhi/Chandigarh' },
    images: ['https://image.pollinations.ai/prompt/Mountains%20and%20adventure%20sports%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to June',
    rating: 4.7,
    reviewCount: 720,
    itinerary: [
      { day: 1, title: 'Arrival & Local Sightseeing', description: 'Visit Hadimba Temple, Vashisht Springs, and Mall Road.', activities: ['Sightseeing'] },
      { day: 2, title: 'Solang Valley', description: 'Full day adventure activities at Solang Valley.', activities: ['Paragliding', 'Zorbing'] },
      { day: 3, title: 'Kullu & Rafting', description: 'Visit Kullu Valley for river rafting.', activities: ['River Rafting'] },
      { day: 4, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Shimla Family Vacation',
    description: 'A pleasant family holiday in the colonial-era summer capital of British India.',
    destination: 'Shimla',
    state: 'Himachal Pradesh',
    price: 13500,
    duration: { days: 3, nights: 2 },
    category: 'Family',
    highlights: ['The Ridge', 'Mall Road', 'Kufri', 'Jakhu Temple'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Premium', name: 'Shimla Heritage Hotel', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Shimla%20hills%20and%20town%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'March to June',
    rating: 4.6,
    reviewCount: 410,
    itinerary: [
      { day: 1, title: 'Arrival & Mall Road', description: 'Check-in and evening stroll on The Ridge and Mall Road.', activities: ['Walking Tour'] },
      { day: 2, title: 'Kufri Excursion', description: 'Day trip to Kufri for snow activities and horse riding.', activities: ['Snow Activities'] },
      { day: 3, title: 'Jakhu Temple & Departure', description: 'Visit Jakhu Temple and depart.', activities: ['Sightseeing', 'Checkout'] }
    ]
  },
  {
    title: 'Spiti Valley Expedition',
    description: 'A rugged and breathtaking road trip through the high-altitude cold desert of Spiti.',
    destination: 'Spiti Valley',
    state: 'Himachal Pradesh',
    price: 28000,
    duration: { days: 7, nights: 6 },
    category: 'Adventure',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Kunzum Pass', 'Kaza'],
    inclusions: ['AC Travel', 'Homestay/Camp Accommodation', 'Breakfast, Dinner', 'Expert Driver/Guide'],
    hotel: { type: 'Standard', name: 'Spiti Homestays & Camps', rating: 3 },
    transport: { type: 'Mixed', details: '4x4 SUV' },
    images: ['https://image.pollinations.ai/prompt/Spiti%20Valley%20landscapes%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'June to September',
    rating: 4.9,
    reviewCount: 200,
    itinerary: [
      { day: 1, title: 'Shimla to Kalpa', description: 'Drive to Kalpa, enjoy views of Kinnaur Kailash.', activities: ['Scenic Drive'] },
      { day: 2, title: 'Kalpa to Kaza', description: 'Drive to Kaza via Nako and Tabo.', activities: ['Monastery Visit'] },
      { day: 3, title: 'Kaza Local', description: 'Visit Key Monastery, Kibber, and Hikkim.', activities: ['Sightseeing'] },
      { day: 4, title: 'Kaza to Chandratal', description: 'Drive over Kunzum Pass to Chandratal Lake.', activities: ['Camping'] },
      { day: 5, title: 'Chandratal to Manali', description: 'Drive to Manali via Rohtang Pass.', activities: ['Off-roading'] },
      { day: 6, title: 'Manali Rest', description: 'Relax in Manali.', activities: ['Leisure'] },
      { day: 7, title: 'Departure', description: 'Depart from Manali.', activities: ['Checkout'] }
    ]
  },
  // UTTARAKHAND
  {
    title: 'Nainital Lake Tour',
    description: 'A peaceful retreat to the Lake District of India.',
    destination: 'Nainital',
    state: 'Uttarakhand',
    price: 11999,
    duration: { days: 3, nights: 2 },
    category: 'Family',
    highlights: ['Naini Lake', 'Naina Devi Temple', 'Snow View Point', 'Mall Road'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing', 'Boating Ticket'],
    hotel: { type: 'Standard', name: 'Lake View Hotel', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab from Delhi' },
    images: ['https://image.pollinations.ai/prompt/Nainital%20Lake%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'March to June',
    rating: 4.5,
    reviewCount: 340,
    itinerary: [
      { day: 1, title: 'Arrival & Boating', description: 'Check-in and evening boating on Naini Lake.', activities: ['Boating'] },
      { day: 2, title: 'Sightseeing', description: 'Cable car to Snow View Point and visit local lakes (Bhimtal, Sattal).', activities: ['Sightseeing'] },
      { day: 3, title: 'Departure', description: 'Morning shopping at Tibetan market and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Mussoorie Hills Package',
    description: 'Enjoy the misty mountains and waterfalls in the Queen of the Hills.',
    destination: 'Mussoorie',
    state: 'Uttarakhand',
    price: 12500,
    duration: { days: 3, nights: 2 },
    category: 'Hill Station',
    highlights: ['Kempty Falls', 'Gun Hill', 'Camel\'s Back Road', 'Mall Road'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Premium', name: 'Mussoorie Grand', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab from Dehradun' },
    images: ['https://image.pollinations.ai/prompt/Mussoorie%20hill%20views%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'March to June',
    rating: 4.6,
    reviewCount: 290,
    itinerary: [
      { day: 1, title: 'Arrival & Mall Road', description: 'Check-in and walk on the Mall Road.', activities: ['Leisure Walk'] },
      { day: 2, title: 'Kempty Falls & Gun Hill', description: 'Visit Kempty Falls and take the ropeway to Gun Hill.', activities: ['Sightseeing'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Char Dham Yatra',
    description: 'The ultimate spiritual journey covering Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    destination: 'Char Dham',
    state: 'Uttarakhand',
    price: 35000,
    duration: { days: 12, nights: 11 },
    category: 'Pilgrimage',
    highlights: ['Yamunotri', 'Gangotri', 'Kedarnath Temple', 'Badrinath Temple'],
    inclusions: ['AC Travel', 'Hotel/Guest House Accommodation', 'Breakfast, Dinner', 'Guide', 'Helicopter booking assistance'],
    hotel: { type: 'Standard', name: 'Pilgrim Guest Houses', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Tempo Traveller' },
    images: ['https://image.pollinations.ai/prompt/Himalayan%20pilgrimage%20sites%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'May to October',
    rating: 4.9,
    reviewCount: 1500,
    itinerary: [
      { day: 1, title: 'Haridwar to Barkot', description: 'Drive to Barkot for Yamunotri.', activities: ['Travel'] },
      { day: 2, title: 'Yamunotri Darshan', description: 'Trek to Yamunotri and return to Barkot.', activities: ['Trekking', 'Darshan'] },
      { day: 3, title: 'Barkot to Uttarkashi', description: 'Drive to Uttarkashi.', activities: ['Travel'] },
      { day: 4, title: 'Gangotri Darshan', description: 'Visit Gangotri and return.', activities: ['Darshan'] },
      { day: 5, title: 'Uttarkashi to Guptkashi', description: 'Drive to Guptkashi.', activities: ['Travel'] },
      { day: 6, title: 'Kedarnath Darshan', description: 'Trek or fly to Kedarnath.', activities: ['Darshan'] },
      { day: 7, title: 'Return to Guptkashi', description: 'Return from Kedarnath.', activities: ['Trekking'] },
      { day: 8, title: 'Guptkashi to Badrinath', description: 'Drive to Badrinath via Chopta.', activities: ['Travel'] },
      { day: 9, title: 'Badrinath Darshan', description: 'Morning darshan at Badrinath.', activities: ['Darshan'] },
      { day: 10, title: 'Badrinath to Rudraprayag', description: 'Drive to Rudraprayag.', activities: ['Travel'] },
      { day: 11, title: 'Rudraprayag to Haridwar', description: 'Return to Haridwar.', activities: ['Travel'] },
      { day: 12, title: 'Departure', description: 'Tour ends.', activities: ['Checkout'] }
    ]
  },
  // JAMMU & KASHMIR
  {
    title: 'Srinagar Paradise Tour',
    description: 'Experience heaven on earth with Shikara rides and Mughal gardens.',
    destination: 'Srinagar',
    state: 'Jammu & Kashmir',
    price: 16999,
    duration: { days: 4, nights: 3 },
    category: 'Family',
    highlights: ['Dal Lake', 'Shikara Ride', 'Mughal Gardens', 'Shankaracharya Temple'],
    inclusions: ['AC Travel', 'Houseboat & Hotel Stay', 'Breakfast, Dinner', 'Local Sightseeing'],
    hotel: { type: 'Premium', name: 'Dal Lake Houseboat / Premium Hotel', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Dal%20Lake%20and%20houseboats%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'April to October',
    rating: 4.8,
    reviewCount: 520,
    itinerary: [
      { day: 1, title: 'Houseboat & Shikara', description: 'Arrive, check into houseboat, and enjoy a Shikara ride on Dal Lake.', activities: ['Shikara Ride'] },
      { day: 2, title: 'Mughal Gardens', description: 'Visit Nishat Bagh and Shalimar Bagh.', activities: ['Sightseeing'] },
      { day: 3, title: 'Sonmarg Excursion', description: 'Day trip to Sonmarg, the meadow of gold.', activities: ['Day Trip'] },
      { day: 4, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Gulmarg Snow Adventure',
    description: 'Hit the slopes and ride the highest cable car in the world.',
    destination: 'Gulmarg',
    state: 'Jammu & Kashmir',
    price: 18500,
    duration: { days: 3, nights: 2 },
    category: 'Adventure',
    highlights: ['Gulmarg Gondola', 'Skiing', 'Snowboarding', 'Afarwat Peak'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Gondola Phase 1 Ticket'],
    hotel: { type: 'Premium', name: 'Gulmarg Ski Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab from Srinagar' },
    images: ['https://image.pollinations.ai/prompt/Snow%20activities%20and%20mountains%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'December to March',
    rating: 4.9,
    reviewCount: 400,
    itinerary: [
      { day: 1, title: 'Arrival & Snow Play', description: 'Drive from Srinagar to Gulmarg, check-in, and play in the snow.', activities: ['Travel', 'Snow Activities'] },
      { day: 2, title: 'Gondola Ride & Skiing', description: 'Take the Gondola ride and try basic skiing.', activities: ['Gondola Ride', 'Skiing'] },
      { day: 3, title: 'Departure', description: 'Drive back to Srinagar airport.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Kashmir Honeymoon Package',
    description: 'A romantic week-long getaway covering the best of Kashmir Valley.',
    destination: 'Kashmir Valley',
    state: 'Jammu & Kashmir',
    price: 32000,
    duration: { days: 6, nights: 5 },
    category: 'Honeymoon',
    highlights: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Romantic Dinner'],
    inclusions: ['AC Travel', 'Premium Hotel & Houseboat', 'Breakfast, Dinner', 'Decorated Room', 'Shikara Ride'],
    hotel: { type: 'Premium', name: 'Luxury Hotels', rating: 4 },
    transport: { type: 'Mixed', details: 'Private AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Romantic%20Kashmir%20scenery%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'March to October',
    rating: 4.8,
    reviewCount: 310,
    itinerary: [
      { day: 1, title: 'Srinagar Arrival', description: 'Check into houseboat, romantic Shikara ride.', activities: ['Shikara Ride'] },
      { day: 2, title: 'Srinagar to Pahalgam', description: 'Drive to Pahalgam, visit Saffron fields on the way.', activities: ['Sightseeing'] },
      { day: 3, title: 'Pahalgam Sightseeing', description: 'Visit Betaab Valley and Aru Valley.', activities: ['Sightseeing'] },
      { day: 4, title: 'Pahalgam to Gulmarg', description: 'Drive to Gulmarg, enjoy the scenic beauty.', activities: ['Travel'] },
      { day: 5, title: 'Gulmarg Gondola & Srinagar', description: 'Gondola ride and return to Srinagar for hotel stay.', activities: ['Gondola Ride'] },
      { day: 6, title: 'Departure', description: 'Drop at Srinagar Airport.', activities: ['Checkout'] }
    ]
  },
  // PUNJAB
  {
    title: 'Amritsar Golden Temple Tour',
    description: 'Experience the spiritual aura of the Golden Temple and the patriotic fervor at Wagah Border.',
    destination: 'Amritsar',
    state: 'Punjab',
    price: 8500,
    duration: { days: 2, nights: 1 },
    category: 'Pilgrimage',
    highlights: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border Ceremony', 'Punjabi Cuisine'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Local Sightseeing'],
    hotel: { type: 'Standard', name: 'Amritsar Inn', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Golden%20Temple%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.8,
    reviewCount: 600,
    itinerary: [
      { day: 1, title: 'Golden Temple & Wagah Border', description: 'Visit Golden Temple, Jallianwala Bagh, and evening Wagah Border retreat ceremony.', activities: ['Sightseeing', 'Ceremony'] },
      { day: 2, title: 'Local Cuisine & Departure', description: 'Enjoy famous Amritsari Kulcha, shop, and depart.', activities: ['Food Tour', 'Checkout'] }
    ]
  },
  // UTTAR PRADESH
  {
    title: 'Agra Taj Mahal Tour',
    description: 'A magical tour of the monument of love and the historic Agra Fort.',
    destination: 'Agra',
    state: 'Uttar Pradesh',
    price: 7999,
    duration: { days: 2, nights: 1 },
    category: 'Cultural',
    highlights: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Standard', name: 'Taj View Hotel', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab from Delhi' },
    images: ['https://image.pollinations.ai/prompt/Taj%20Mahal%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    reviewCount: 850,
    itinerary: [
      { day: 1, title: 'Agra Fort & Sunset Taj', description: 'Visit Agra Fort and view the Taj Mahal from Mehtab Bagh at sunset.', activities: ['Sightseeing'] },
      { day: 2, title: 'Sunrise Taj & Fatehpur Sikri', description: 'Sunrise visit to Taj Mahal, then Fatehpur Sikri before departure.', activities: ['Monument Visit', 'Checkout'] }
    ]
  },
  {
    title: 'Varanasi Spiritual Journey',
    description: 'Witness the ancient rituals and spirituality on the ghats of the holy river Ganges.',
    destination: 'Varanasi',
    state: 'Uttar Pradesh',
    price: 11500,
    duration: { days: 3, nights: 2 },
    category: 'Pilgrimage',
    highlights: ['Ganga Aarti', 'Kashi Vishwanath Temple', 'Sarnath', 'Morning Boat Ride'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Boat Ride'],
    hotel: { type: 'Standard', name: 'Ganges View Hotel', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Ganga%20ghats%20and%20temples%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.8,
    reviewCount: 530,
    itinerary: [
      { day: 1, title: 'Arrival & Evening Aarti', description: 'Arrive and witness the mesmerizing Ganga Aarti at Dashashwamedh Ghat.', activities: ['Aarti'] },
      { day: 2, title: 'Morning Boat Ride & Temple', description: 'Early morning boat ride, Kashi Vishwanath darshan, and visit Sarnath.', activities: ['Boating', 'Darshan'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  // MADHYA PRADESH
  {
    title: 'Khajuraho Heritage Tour',
    description: 'Explore the stunning ancient temples of Khajuraho known for their intricate sculptures.',
    destination: 'Khajuraho',
    state: 'Madhya Pradesh',
    price: 12999,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['Western Group of Temples', 'Eastern Group of Temples', 'Light and Sound Show'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Premium', name: 'Khajuraho Heritage Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Khajuraho%20temples%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.6,
    reviewCount: 220,
    itinerary: [
      { day: 1, title: 'Arrival & Light Show', description: 'Check-in and evening Light and Sound show at the temples.', activities: ['Show'] },
      { day: 2, title: 'Temple Tour', description: 'Full day guided tour of Western and Eastern temple groups.', activities: ['Heritage Walk'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Bandhavgarh Wildlife Safari',
    description: 'An exciting wildlife safari in the national park with the highest density of Royal Bengal Tigers.',
    destination: 'Bandhavgarh',
    state: 'Madhya Pradesh',
    price: 18500,
    duration: { days: 3, nights: 2 },
    category: 'Wildlife',
    highlights: ['Tiger Safari', 'Bandhavgarh Fort', 'Wildlife Photography'],
    inclusions: ['AC Travel', 'Jungle Resort Stay', 'Breakfast, Lunch, Dinner', '2 Jeep Safaris', 'Guide'],
    hotel: { type: 'Premium', name: 'Tiger Safari Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'Open Jeep for Safari' },
    images: ['https://image.pollinations.ai/prompt/Tigers%20and%20jungle%20safari%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to June',
    rating: 4.8,
    reviewCount: 390,
    itinerary: [
      { day: 1, title: 'Arrival & Evening Safari', description: 'Check-in to resort and take the afternoon jungle safari.', activities: ['Jeep Safari'] },
      { day: 2, title: 'Morning Safari & Fort', description: 'Early morning safari, afternoon visit to Bandhavgarh Fort.', activities: ['Safari', 'Sightseeing'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  // GUJARAT
  {
    title: 'Statue of Unity Tour',
    description: 'Visit the world\'s tallest statue and the surrounding beautiful attractions.',
    destination: 'Kevadia',
    state: 'Gujarat',
    price: 9500,
    duration: { days: 2, nights: 1 },
    category: 'Family',
    highlights: ['Statue of Unity Viewing Gallery', 'Valley of Flowers', 'Sardar Sarovar Dam', 'Laser Show'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Entry Tickets', 'Guide'],
    hotel: { type: 'Standard', name: 'Tent City Narmada', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab from Ahmedabad/Vadodara' },
    images: ['https://image.pollinations.ai/prompt/Statue%20of%20Unity%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    reviewCount: 450,
    itinerary: [
      { day: 1, title: 'Statue & Laser Show', description: 'Visit the viewing gallery, Valley of Flowers, and evening laser show.', activities: ['Sightseeing', 'Laser Show'] },
      { day: 2, title: 'Dam & Departure', description: 'Visit Sardar Sarovar Dam and departure.', activities: ['Sightseeing', 'Checkout'] }
    ]
  },
  {
    title: 'Rann of Kutch Festival Package',
    description: 'Experience the mesmerizing white salt desert during the vibrant Rann Utsav.',
    destination: 'Kutch',
    state: 'Gujarat',
    price: 15999,
    duration: { days: 3, nights: 2 },
    category: 'Cultural',
    highlights: ['White Desert', 'Rann Utsav', 'Kala Dungar', 'Local Handicrafts'],
    inclusions: ['AC Travel', 'Tent Accommodation', 'Breakfast, Lunch, Dinner', 'Cultural Programs', 'Permits'],
    hotel: { type: 'Premium', name: 'Rann Utsav Tent City', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab from Bhuj' },
    images: ['https://image.pollinations.ai/prompt/White%20desert%20and%20festival%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'November to February',
    rating: 4.9,
    reviewCount: 600,
    itinerary: [
      { day: 1, title: 'Arrival & White Desert', description: 'Arrive in Tent City, evening visit to the White Rann for sunset.', activities: ['Sightseeing', 'Cultural Event'] },
      { day: 2, title: 'Kala Dungar & Villages', description: 'Visit the highest point in Kutch and local artisan villages.', activities: ['Sightseeing', 'Shopping'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  // WEST BENGAL
  {
    title: 'Darjeeling Tea Estate Tour',
    description: 'Wake up to the views of Mount Kanchenjunga and explore world-famous tea gardens.',
    destination: 'Darjeeling',
    state: 'West Bengal',
    price: 13500,
    duration: { days: 4, nights: 3 },
    category: 'Hill Station',
    highlights: ['Tiger Hill Sunrise', 'Batasia Loop', 'Tea Gardens', 'Himalayan Mountaineering Institute'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Sightseeing'],
    hotel: { type: 'Standard', name: 'Darjeeling Heritage Hotel', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab from Bagdogra/NJP' },
    images: ['https://image.pollinations.ai/prompt/Tea%20gardens%20and%20mountains%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'March to May, September to November',
    rating: 4.6,
    reviewCount: 430,
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive and stroll through the Mall Road.', activities: ['Leisure'] },
      { day: 2, title: 'Tiger Hill & Sightseeing', description: 'Early morning Tiger Hill sunrise, visit Ghoom Monastery and Batasia Loop.', activities: ['Sightseeing'] },
      { day: 3, title: 'Tea Gardens & Zoo', description: 'Visit Happy Valley Tea Estate, Zoo, and HMI.', activities: ['Sightseeing'] },
      { day: 4, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Sundarbans Wildlife Package',
    description: 'Navigate through the largest mangrove forest, home to the Royal Bengal Tiger.',
    destination: 'Sundarbans',
    state: 'West Bengal',
    price: 11999,
    duration: { days: 3, nights: 2 },
    category: 'Wildlife',
    highlights: ['Mangrove Safari', 'Watchtowers', 'Village Walk', 'Bird Watching'],
    inclusions: ['AC Travel', 'Resort Accommodation', 'Breakfast, Lunch, Dinner', 'Boat Safari', 'Guide'],
    hotel: { type: 'Standard', name: 'Sundarban Eco Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'Boat Safari & AC Cab from Kolkata' },
    images: ['https://image.pollinations.ai/prompt/Mangrove%20forests%20and%20wildlife%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'September to March',
    rating: 4.5,
    reviewCount: 210,
    itinerary: [
      { day: 1, title: 'Arrival & Village Tour', description: 'Transfer from Kolkata, check-in, and evening village walk.', activities: ['Village Walk'] },
      { day: 2, title: 'Full Day Boat Safari', description: 'Cruise through the creeks and visit watchtowers for tiger spotting.', activities: ['Boat Safari'] },
      { day: 3, title: 'Departure', description: 'Morning local sightseeing and return to Kolkata.', activities: ['Checkout'] }
    ]
  },
  // ODISHA
  {
    title: 'Puri Jagannath Tour',
    description: 'Seek blessings at the Jagannath Temple and relax on the Golden Beach.',
    destination: 'Puri',
    state: 'Odisha',
    price: 8500,
    duration: { days: 2, nights: 1 },
    category: 'Pilgrimage',
    highlights: ['Jagannath Temple', 'Puri Beach', 'Chilika Lake (Optional)'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Guide', 'Temple Darshan'],
    hotel: { type: 'Standard', name: 'Puri Beach Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Jagannath%20Temple%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    reviewCount: 520,
    itinerary: [
      { day: 1, title: 'Temple Darshan & Beach', description: 'Visit the Jagannath Temple and spend the evening at the beach.', activities: ['Darshan', 'Beach Walk'] },
      { day: 2, title: 'Departure', description: 'Morning sunrise at beach and departure.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Konark Heritage Package',
    description: 'Marvel at the architectural grandeur of the Sun Temple, a UNESCO World Heritage site.',
    destination: 'Konark',
    state: 'Odisha',
    price: 9999,
    duration: { days: 2, nights: 1 },
    category: 'Cultural',
    highlights: ['Sun Temple', 'Chandrabhaga Beach', 'Konark Museum'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast', 'Guide', 'Entry Tickets'],
    hotel: { type: 'Standard', name: 'Lotus Eco Resort', rating: 3 },
    transport: { type: 'Mixed', details: 'AC Cab' },
    images: ['https://image.pollinations.ai/prompt/Konark%20Sun%20Temple%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to March',
    rating: 4.8,
    reviewCount: 340,
    itinerary: [
      { day: 1, title: 'Sun Temple & Beach', description: 'Guided tour of the Sun Temple and sunset at Chandrabhaga Beach.', activities: ['Heritage Tour', 'Beach Visit'] },
      { day: 2, title: 'Museum & Departure', description: 'Visit ASI museum and depart.', activities: ['Museum Visit', 'Checkout'] }
    ]
  },
  // SIKKIM
  {
    title: 'Gangtok Himalayan Tour',
    description: 'Experience the serene monasteries, lakes, and views of the Himalayas in Sikkim.',
    destination: 'Gangtok',
    state: 'Sikkim',
    price: 14500,
    duration: { days: 4, nights: 3 },
    category: 'Hill Station',
    highlights: ['Tsomgo Lake', 'Baba Mandir', 'Rumtek Monastery', 'MG Marg'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing', 'Permits'],
    hotel: { type: 'Premium', name: 'Gangtok View Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'Innova/Xylo for Hills' },
    images: ['/assets/gangtok.jpg'],
    bestTimeToVisit: 'March to May, October to mid-December',
    rating: 4.7,
    reviewCount: 480,
    itinerary: [
      { day: 1, title: 'Arrival in Gangtok', description: 'Arrive, relax, and explore MG Marg in the evening.', activities: ['Leisure', 'Shopping'] },
      { day: 2, title: 'Tsomgo Lake & Baba Mandir', description: 'Excursion to the glacial Tsomgo Lake and Baba Mandir.', activities: ['Sightseeing'] },
      { day: 3, title: 'City Tour', description: 'Visit Rumtek Monastery, Do Drul Chorten, and viewpoints.', activities: ['Monastery Visit'] },
      { day: 4, title: 'Departure', description: 'Drive back to Bagdogra/NJP.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'North Sikkim Adventure',
    description: 'An extreme adventure to the high altitude lakes and valleys of North Sikkim.',
    destination: 'North Sikkim',
    state: 'Sikkim',
    price: 22000,
    duration: { days: 5, nights: 4 },
    category: 'Adventure',
    highlights: ['Lachen', 'Lachung', 'Gurudongmar Lake', 'Yumthang Valley'],
    inclusions: ['Travel', 'Hotel/Homestay Accommodation', 'Breakfast, Lunch, Dinner', 'Special Permits', 'Guide'],
    hotel: { type: 'Standard', name: 'Lachen & Lachung Homestays', rating: 3 },
    transport: { type: 'Mixed', details: 'Sturdy SUV' },
    images: ['https://image.pollinations.ai/prompt/Snow%20mountains%20and%20valleys%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'April to June, October to November',
    rating: 4.9,
    reviewCount: 190,
    itinerary: [
      { day: 1, title: 'Gangtok to Lachen', description: 'Drive to Lachen, enjoying waterfalls on the way.', activities: ['Travel'] },
      { day: 2, title: 'Gurudongmar Lake', description: 'Early morning visit to Gurudongmar Lake, then drive to Lachung.', activities: ['Sightseeing'] },
      { day: 3, title: 'Yumthang Valley', description: 'Visit the Valley of Flowers and zero point (optional).', activities: ['Sightseeing'] },
      { day: 4, title: 'Lachung to Gangtok', description: 'Drive back to Gangtok.', activities: ['Travel'] },
      { day: 5, title: 'Departure', description: 'Depart from Gangtok.', activities: ['Checkout'] }
    ]
  },
  // ASSAM
  {
    title: 'Kaziranga Wildlife Safari',
    description: 'Spot the one-horned rhinoceros in the expansive grasslands of Kaziranga.',
    destination: 'Kaziranga',
    state: 'Assam',
    price: 13500,
    duration: { days: 3, nights: 2 },
    category: 'Wildlife',
    highlights: ['Jeep Safari', 'Elephant Safari', 'Orchid Park', 'One-horned Rhino spotting'],
    inclusions: ['AC Travel', 'Resort Accommodation', 'Breakfast, Dinner', '1 Jeep Safari, 1 Elephant Safari', 'Guide'],
    hotel: { type: 'Premium', name: 'Kaziranga Eco Resort', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab & Safari Vehicles' },
    images: ['https://image.pollinations.ai/prompt/One-horned%20rhinoceros%20safari%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'November to April',
    rating: 4.8,
    reviewCount: 270,
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive in Kaziranga, check-in, and visit the Orchid Park.', activities: ['Sightseeing'] },
      { day: 2, title: 'Safaris', description: 'Early morning Elephant safari and afternoon Jeep safari in the central range.', activities: ['Wildlife Safari'] },
      { day: 3, title: 'Departure', description: 'Morning breakfast and departure.', activities: ['Checkout'] }
    ]
  },
  // MEGHALAYA
  {
    title: 'Shillong & Cherrapunji Tour',
    description: 'Explore the abode of clouds, living root bridges, and spectacular waterfalls.',
    destination: 'Shillong',
    state: 'Meghalaya',
    price: 17500,
    duration: { days: 5, nights: 4 },
    category: 'Adventure',
    highlights: ['Umiam Lake', 'Living Root Bridge', 'Dawki River', 'Nohkalikai Falls'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Local Sightseeing', 'Guide'],
    hotel: { type: 'Premium', name: 'Shillong Boutique Hotel', rating: 4 },
    transport: { type: 'Mixed', details: 'AC SUV' },
    images: ['https://image.pollinations.ai/prompt/Meghalaya%20waterfalls%20and%20valleys%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'October to May',
    rating: 4.8,
    reviewCount: 310,
    itinerary: [
      { day: 1, title: 'Arrival & Umiam Lake', description: 'Arrive in Guwahati, drive to Shillong via Umiam Lake.', activities: ['Sightseeing'] },
      { day: 2, title: 'Cherrapunji Excursion', description: 'Visit Nohkalikai Falls, Mawsmai Cave, and Seven Sisters Falls.', activities: ['Sightseeing'] },
      { day: 3, title: 'Dawki & Mawlynnong', description: 'Visit the cleanest village and boat on the crystal clear Dawki river.', activities: ['Boating', 'Village Tour'] },
      { day: 4, title: 'Shillong Local', description: 'Visit Don Bosco Museum, Ward\'s Lake, and local markets.', activities: ['City Tour'] },
      { day: 5, title: 'Departure', description: 'Drive back to Guwahati for departure.', activities: ['Checkout'] }
    ]
  },
  // LADAKH
  {
    title: 'Leh Ladakh Bike Expedition',
    description: 'The ultimate motorcycle road trip through the highest motorable passes in the world.',
    destination: 'Leh',
    state: 'Ladakh',
    price: 32000,
    duration: { days: 7, nights: 6 },
    category: 'Adventure',
    highlights: ['Khardung La Pass', 'Nubra Valley', 'Pangong Tso', 'Magnetic Hill'],
    inclusions: ['Royal Enfield Bike', 'Fuel', 'Accommodation (Camps/Hotels)', 'Breakfast, Dinner', 'Mechanic & Backup Vehicle'],
    hotel: { type: 'Standard', name: 'Ladakh Camps & Hotels', rating: 3 },
    transport: { type: 'Mixed', details: 'Royal Enfield 500cc' },
    images: ['https://image.pollinations.ai/prompt/Bikes%20on%20Ladakh%20roads%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'June to September',
    rating: 4.9,
    reviewCount: 850,
    itinerary: [
      { day: 1, title: 'Arrival & Acclimatization', description: 'Arrive in Leh by flight, rest and acclimatize.', activities: ['Rest'] },
      { day: 2, title: 'Leh Local Sightseeing', description: 'Ride to Magnetic Hill, Pathar Sahib, and Shanti Stupa.', activities: ['Riding', 'Sightseeing'] },
      { day: 3, title: 'Leh to Nubra Valley', description: 'Ride across Khardung La Pass to Nubra.', activities: ['Riding', 'High Pass'] },
      { day: 4, title: 'Nubra to Pangong Lake', description: 'Ride via Shyok route to the stunning Pangong Lake.', activities: ['Riding', 'Camping'] },
      { day: 5, title: 'Pangong to Leh', description: 'Ride back to Leh via Chang La Pass.', activities: ['Riding'] },
      { day: 6, title: 'Leh Market', description: 'Rest day, explore Leh market and cafes.', activities: ['Shopping', 'Leisure'] },
      { day: 7, title: 'Departure', description: 'Fly out of Leh.', activities: ['Checkout'] }
    ]
  },
  {
    title: 'Pangong Lake Adventure',
    description: 'A focused tour to the mesmerizing blue waters of Pangong Tso.',
    destination: 'Pangong Lake',
    state: 'Ladakh',
    price: 18500,
    duration: { days: 4, nights: 3 },
    category: 'Adventure',
    highlights: ['Pangong Tso', 'Chang La Pass', 'Thiksey Monastery', 'Hemis Monastery'],
    inclusions: ['AC Travel', 'Hotel & Camp Accommodation', 'Breakfast, Dinner', 'Permits', 'Oxygen Cylinder in cab'],
    hotel: { type: 'Premium', name: 'Pangong Luxury Camps', rating: 4 },
    transport: { type: 'Mixed', details: 'AC SUV (Innova/Xylo)' },
    images: ['https://image.pollinations.ai/prompt/Pangong%20Lake%2C%20Ladakh%2C%20ultra-realistic%20travel%20photography%2C%204K%2C%20vibrant%20colors%2C%20cinematic%20composition?width=800&height=600&nologo=true'],
    bestTimeToVisit: 'May to September',
    rating: 4.8,
    reviewCount: 420,
    itinerary: [
      { day: 1, title: 'Arrival & Acclimatization', description: 'Arrive in Leh, rest.', activities: ['Rest'] },
      { day: 2, title: 'Leh to Pangong', description: 'Drive to Pangong Lake via Chang La Pass, overnight camp.', activities: ['Travel', 'Camping'] },
      { day: 3, title: 'Pangong to Leh', description: 'Morning at the lake, drive back to Leh, visiting monasteries.', activities: ['Sightseeing'] },
      { day: 4, title: 'Departure', description: 'Morning departure from Leh.', activities: ['Checkout'] }
    ]
  },
  // ANDAMAN & NICOBAR
  {
    title: 'Andaman Island Paradise Package',
    description: 'A tropical paradise offering pristine beaches, clear waters, and historical monuments.',
    destination: 'Andaman Islands',
    state: 'Andaman & Nicobar',
    price: 28500,
    duration: { days: 6, nights: 5 },
    category: 'Beach',
    highlights: ['Cellular Jail', 'Radhanagar Beach', 'Elephant Beach', 'Scuba Diving'],
    inclusions: ['AC Travel', 'Hotel Accommodation', 'Breakfast, Dinner', 'Ferry Tickets', 'Airport Transfers'],
    hotel: { type: 'Premium', name: 'Andaman Beach Resorts', rating: 4 },
    transport: { type: 'Mixed', details: 'AC Cab & Private Cruise' },
    images: ['/assets/andaman_island.jpg'],
    bestTimeToVisit: 'October to May',
    rating: 4.8,
    reviewCount: 630,
    itinerary: [
      { day: 1, title: 'Arrival & Cellular Jail', description: 'Arrive in Port Blair, visit Cellular Jail and Light & Sound show.', activities: ['Sightseeing'] },
      { day: 2, title: 'Havelock Island', description: 'Ferry to Havelock, relax at Radhanagar Beach (Asia\'s best beach).', activities: ['Ferry Ride', 'Beach'] },
      { day: 3, title: 'Elephant Beach', description: 'Excursion to Elephant beach for water sports and snorkeling.', activities: ['Water Sports'] },
      { day: 4, title: 'Neil Island', description: 'Ferry to Neil Island, visit Natural Bridge and Bharatpur beach.', activities: ['Sightseeing'] },
      { day: 5, title: 'Return to Port Blair', description: 'Ferry back to Port Blair, evening shopping.', activities: ['Ferry Ride', 'Shopping'] },
      { day: 6, title: 'Departure', description: 'Transfer to Port Blair airport.', activities: ['Checkout'] }
    ]
  }
];

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing packages before seeding to avoid duplicates
    try {
      await Package.deleteMany({});
      console.log('Cleared existing packages');
      
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
