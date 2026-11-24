require('dotenv').config();
const mongoose = require('mongoose');
const Venue = require('../modules/venues/venue.model');
const logger = require('../utils/logger');

const sampleVenues = [
  {
    name: 'The Grand Heritage Palace & Royal Gardens',
    slug: 'the-grand-heritage-palace-royal-gardens-101',
    description:
      'Immerse your guests in majestic Rajputana royalty. Spread across 18 acres of landscaped Mughal gardens with ornate marble arches, hand-painted fresco ceilings, shimmering mirror work, and illuminated lotus pools. Offers an unmatched royal backdrop for grand destination weddings, sangeet galas, and anniversary banquets.',
    location: {
      address: 'Amer Road, Near Jal Mahal, Heritage Corridor',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302002',
      coordinates: { lat: 26.9654, lng: 75.8509 },
    },
    eventTypes: ['wedding', 'engagement', 'anniversary', 'reception', 'corporate'],
    capacity: { min: 300, max: 2000 },
    pricing: {
      startingPrice: 350000,
      pricePerPlate: 2800,
      currency: 'INR',
    },
    venueType: 'farmhouse',
    facilities: [
      'Valet Parking for 500+ cars',
      'Central Air Conditioning',
      'Bridal Green Rooms (4)',
      'In-house Royal Masterchefs',
      'Helipad Access',
      'Fireworks Permission',
      'Luxury Guest Rooms (45)',
      'Power Backup 100%',
      'Alcohol Served & Allowed',
      'DJ Sound & Laser Setup Permitted',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.9, count: 184 },
  },
  {
    name: 'The Glasshouse Waterfront Lawn & Ballroom',
    slug: 'the-glasshouse-waterfront-lawn-ballroom-102',
    description:
      'Perched right along the Arabian Sea with panoramic sunset views. Features soaring 24-foot glass facades, European crystal chandeliers, and an open seaside breeze lawn. Ideal for luxury cocktail sangeets, sunset wedding ceremonies, and chic corporate award ceremonies.',
    location: {
      address: 'Carter Road Promenade, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: { lat: 19.0657, lng: 72.8252 },
    },
    eventTypes: ['wedding', 'birthday', 'engagement', 'corporate', 'anniversary'],
    capacity: { min: 150, max: 800 },
    pricing: {
      startingPrice: 220000,
      pricePerPlate: 2400,
      currency: 'INR',
    },
    venueType: 'rooftop',
    facilities: [
      'Seafront Promenade Lawn',
      'Valet Parking Service',
      'Multi-cuisine Live Counters',
      'Acoustically Tuned Ballroom',
      'Bridal Suites (2)',
      'Cocktail Bar Counter',
      'Full Elevator & Ramp Access',
      'High-speed Wi-Fi',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.8, count: 142 },
  },
  {
    name: 'Orchid Imperial Convention Center & Grand Ballroom',
    slug: 'orchid-imperial-convention-center-103',
    description:
      'A state-of-the-art monumental convention space featuring pillarless grand ballrooms, motorized LED rigging, soundproof partition walls, and massive banquet dining wings near the international airport.',
    location: {
      address: 'Asset Area 12, Hospitality District, Aerocity',
      city: 'Delhi NCR',
      state: 'Delhi',
      pincode: '110037',
      coordinates: { lat: 28.5535, lng: 77.1215 },
    },
    eventTypes: ['corporate', 'wedding', 'farewell', 'reception'],
    capacity: { min: 200, max: 1500 },
    pricing: {
      startingPrice: 195000,
      pricePerPlate: 1950,
      currency: 'INR',
    },
    venueType: 'banquet',
    facilities: [
      'Pillarless 18,000 sq ft Ballroom',
      'Subway / Metro Connected',
      'Underground Multi-level Parking (800 cars)',
      '4K Laser Projection Screens',
      'Simultaneous Translation Booths',
      'Dedicated Catering Kitchens',
      'VIP Green Lounges',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 96 },
  },
  {
    name: 'Sea Breeze Luxury Cliffside Villa & Deck',
    slug: 'sea-breeze-luxury-cliffside-villa-104',
    description:
      'Private Goan heritage villa nested on a tropical cliff facing the sunset over the sea. Boasts an infinity pool, private beach access, coconut grove lawns, and private party deck.',
    location: {
      address: 'Aguada Fort Road, Sinquerim',
      city: 'Goa',
      state: 'Goa',
      pincode: '403515',
      coordinates: { lat: 15.4926, lng: 73.7736 },
    },
    eventTypes: ['birthday', 'engagement', 'wedding', 'farewell', 'anniversary'],
    capacity: { min: 50, max: 350 },
    pricing: {
      startingPrice: 280000,
      pricePerPlate: 3200,
      currency: 'INR',
    },
    venueType: 'outdoor',
    facilities: [
      'Direct Private Beach Cove',
      'Infinity Pool Deck',
      'Boutique Portuguese Suites (8)',
      'Outdoor Barbeque & Woodfire Oven',
      'Live Music Acoustics',
      'Private Butler Service',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.9, count: 78 },
  },
  {
    name: 'Botanical Palms Garden Estate & Pavilion',
    slug: 'botanical-palms-garden-estate-105',
    description:
      'An emerald sanctuary surrounded by 3,000 palm trees, open-air wooden pavilions, and natural stone pathways. A serene sanctuary for eco-luxe weddings, bohemian receptions, and family reunions.',
    location: {
      address: 'Varthur Main Road, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      coordinates: { lat: 12.9698, lng: 77.7499 },
    },
    eventTypes: ['wedding', 'baby_shower', 'birthday', 'engagement'],
    capacity: { min: 100, max: 1200 },
    pricing: {
      startingPrice: 210000,
      pricePerPlate: 1850,
      currency: 'INR',
    },
    venueType: 'outdoor',
    facilities: [
      '5-Acre Natural Lawns',
      'Covered Bamboo Glass Dining Pavilion',
      'Eco-friendly Lighting System',
      'Organic Farm-to-Table Catering Kitchen',
      'Kid Friendly Play Area',
      'Parking for 350 Cars',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: false,
    ratings: { average: 4.8, count: 110 },
  },
  {
    name: 'Emerald Courtyard Banquet & Rooftop Lounge',
    slug: 'emerald-courtyard-banquet-106',
    description:
      'Sophisticated contemporary banquet hall located in prime Banjara Hills. Designed with warm gold accents, ambient recessed lighting, high ceilings, and an adjoining open sky terrace.',
    location: {
      address: 'Road No. 12, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      coordinates: { lat: 17.4156, lng: 78.4357 },
    },
    eventTypes: ['engagement', 'birthday', 'baby_shower', 'corporate'],
    capacity: { min: 80, max: 500 },
    pricing: {
      startingPrice: 160000,
      pricePerPlate: 1700,
      currency: 'INR',
    },
    venueType: 'indoor',
    facilities: [
      'Fully Air Conditioned',
      'In-house Nizami Gourmet Catering',
      'Covered Terrace Lounge',
      'State-of-the-art Audio System',
      'Valet Parking',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
        isPrimary: false,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: false,
    ratings: { average: 4.7, count: 65 },
  },
  {
    name: 'Lake Pichola Royal Pavilions & Shikara Ghat',
    slug: 'lake-pichola-royal-pavilions-107',
    description:
      'World-famous lakeside palace offering private shikara boat transfers, candlelit marble jharokhas, and unobstructed views of Udaipur city palace illuminated at night.',
    location: {
      address: 'Haridas Ji Ki Magri, Lake Pichola Waterfront',
      city: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001',
      coordinates: { lat: 24.5765, lng: 73.6835 },
    },
    eventTypes: ['wedding', 'engagement', 'anniversary'],
    capacity: { min: 100, max: 700 },
    pricing: {
      startingPrice: 420000,
      pricePerPlate: 3500,
      currency: 'INR',
    },
    venueType: 'farmhouse',
    facilities: [
      'Private Island Shikara Ghat',
      'Mewari Folk Performance Stage',
      'Heritage Suites (30)',
      'Lakefront Dining Courtyards',
      'Dedicated Event Concierge',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    ratings: { average: 5.0, count: 215 },
  },
  {
    name: 'Skyline Panorama Glass Deck & Terrace',
    slug: 'skyline-panorama-glass-deck-108',
    description:
      'Trendy high-rise glass lounge overlooking the Pune skyline. Features an electric retractable glass roof, signature craft cocktails, and high-energy acoustics for birthday bashes and farewell parties.',
    location: {
      address: 'Koregaon Park North Main Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      coordinates: { lat: 18.5362, lng: 73.8958 },
    },
    eventTypes: ['birthday', 'farewell', 'corporate', 'engagement'],
    capacity: { min: 50, max: 300 },
    pricing: {
      startingPrice: 110000,
      pricePerPlate: 1450,
      currency: 'INR',
    },
    venueType: 'rooftop',
    facilities: [
      'Retractable Glass Roof',
      'DJ Booth with Pioneer Mixers',
      'Private VIP Pods',
      'Craft Beer Taps',
      'Valet Parking',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
        isPrimary: true,
      },
    ],
    status: 'approved',
    isVerified: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 52 },
  },
];

async function seedVenues() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.error('MONGODB_URI is required to run seed');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB for venue seeding...');

    for (const venue of sampleVenues) {
      await Venue.findOneAndUpdate({ slug: venue.slug }, venue, {
        upsert: true,
        new: true,
      });
    }

    const count = await Venue.countDocuments();
    logger.info(`✅ Venue seeding completed successfully! Total venues in DB: ${count}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Venue seeding failed');
    process.exit(1);
  }
}

if (require.main === module) {
  seedVenues();
}

module.exports = { sampleVenues, seedVenues };
