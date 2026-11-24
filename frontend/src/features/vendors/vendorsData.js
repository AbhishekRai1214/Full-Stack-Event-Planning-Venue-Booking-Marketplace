export const sampleVendors = [
  {
    id: 'v1',
    businessName: 'Studio Lumière Photography & Cinema',
    slug: 'studio-lumiere-photography-cinema-201',
    category: 'photographer',
    description:
      'National award-winning wedding and fashion photographers specializing in royal destination weddings, emotional candid moments, cinematic 4K drone cinematography, and heirloom coffee-table albums.',
    avatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      serviceAreas: ['Mumbai', 'Goa', 'Jaipur', 'Udaipur', 'Dubai'],
    },
    experience: 12,
    startingPrice: 75000,
    packages: [
      {
        id: 'p1',
        name: 'Classic Candid Package',
        description: 'Ideal for 1-day intimate wedding or engagement celebration.',
        price: 75000,
        includes: [
          '1 Lead Candid Photographer',
          '1 Traditional Photographer',
          '350+ Retouched High-Res Photos',
          'Online Digital Cloud Gallery for 1 Year',
        ],
      },
      {
        id: 'p2',
        name: 'Royal Destination Heritage Tier',
        description: 'Comprehensive 3-day wedding celebration coverage with cinema team.',
        price: 210000,
        includes: [
          '2 Candid Photographers + 2 Cinematographers',
          '4K Aerial Drone Coverage',
          '3-5 Minute Teaser Reel within 72 Hours',
          '20-30 Minute Full Wedding Film',
          '2 Premium Leather Bound Flushmount Albums',
        ],
      },
    ],
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        caption: 'Royal Vows at Lake Palace',
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        caption: 'Sunset Sangeet Euphoria',
      },
      {
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
        caption: 'Bridal Portrait in Amber Fort',
      },
    ],
    contact: {
      phone: '+91 98200 44211',
      email: 'bookings@studiolumiere.com',
      instagram: '@studiolumierefilms',
      website: 'https://studiolumiere.com',
    },
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.9, count: 146 },
  },
  {
    id: 'v2',
    businessName: 'Royal Spice Gourmet Banquets & Caterers',
    slug: 'royal-spice-gourmet-banquets-caterers-202',
    category: 'caterer',
    description:
      'Celebrated bespoke culinary masters crafting royal Awadhi, Mughlai, authentic Marwari, coastal Malabari, and world-class live European counters. Over 16 years of curating feasts for dignitaries and celebrity celebrations.',
    avatar: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85',
    location: {
      city: 'Delhi NCR',
      state: 'Delhi',
      serviceAreas: ['Delhi NCR', 'Jaipur', 'Agra', 'Chandigarh'],
    },
    experience: 16,
    startingPrice: 120000,
    packages: [
      {
        id: 'p3',
        name: 'Silver Feast (Per Plate ₹1,800)',
        description: 'Appetizers (6), Main Courses (10), Desserts (4), Live Mocktail Bar.',
        price: 120000,
        includes: [
          'Live Tandoor & Dim Sum Station',
          'Awadhi Biryani & Dal Makhani Specialties',
          'Full Uniformed Service Staff & Cutlery',
        ],
      },
      {
        id: 'p4',
        name: 'Imperial Royal Dastarkhwan (Per Plate ₹2,800)',
        description: 'Exotic Global & Royal Indian 45-dish banquet experience.',
        price: 280000,
        includes: [
          '12 Live Interactive World Food Themed Counters',
          'Artisanal Dessert Parlour with Nitrogen Kulfi',
          'German Silver Tableware & Crystal Glassware',
        ],
      },
    ],
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        caption: 'Signature Live Chaat & Mezze Counter',
      },
    ],
    contact: {
      phone: '+91 98110 33882',
      email: 'events@royalspicecaterers.in',
      instagram: '@royalspicebanquets',
      website: 'https://royalspicecaterers.in',
    },
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.8, count: 118 },
  },
  {
    id: 'v3',
    businessName: 'Aura Bloom Floral & Theme Decorators',
    slug: 'aura-bloom-floral-theme-decorators-203',
    category: 'decorator',
    description:
      'Visionary spatial designers crafting majestic mandaps, fairy-light botanical tunnels, bohemian sangeet lounges, and grand floral installations with Dutch imports and exotic native blooms.',
    avatar: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      serviceAreas: ['Bengaluru', 'Mysuru', 'Hyderabad', 'Chennai'],
    },
    experience: 9,
    startingPrice: 90000,
    packages: [
      {
        id: 'p5',
        name: 'Pastel Garden Elegance',
        description: 'Floral stage backdrop, photobooth, and fairy-lit dining walkway.',
        price: 90000,
        includes: [
          'Hydrangea & Rose Entrance Arch',
          '12x8 ft Personalized Photo Backdrop',
          'Warm Edison Fairy Light Installation',
        ],
      },
      {
        id: 'p6',
        name: 'Royal Heritage Glass Mandap',
        description: 'Floating lotus pool mandap with 10,000 fresh marigolds & tuberoses.',
        price: 250000,
        includes: [
          'Custom 360-degree Acrylic Mandap Pillar Structure',
          'Hanging Mogra & Jasmine Chandeliers',
          'Sangeet LED Stage Rigging & Ambient Uplighting',
        ],
      },
    ],
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
        caption: 'Bohemian Sunset Mandap in Whitefield',
      },
    ],
    contact: {
      phone: '+91 99000 87123',
      email: 'hello@aurabloomdecor.com',
      instagram: '@aurabloomdesign',
      website: '',
    },
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.9, count: 89 },
  },
  {
    id: 'v4',
    businessName: 'DJ Rakesh & Electric Symphony Beats',
    slug: 'dj-rakesh-electric-symphony-beats-204',
    category: 'dj',
    description:
      'Premier celebrity sangeet and afterparty DJ with top-tier concert grade JBL VerTec Line Arrays, dynamic CO2 jets, laser synths, and seamless Bollywood, Punjabi, Retro, and EDM mashups.',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
    location: {
      city: 'Goa',
      state: 'Goa',
      serviceAreas: ['Goa', 'Mumbai', 'Pune', 'Bengaluru'],
    },
    experience: 8,
    startingPrice: 45000,
    packages: [
      {
        id: 'p7',
        name: 'Cocktail & Afterparty Setup',
        description: '4-hour high energy live DJ session with Pioneer Nexus console.',
        price: 45000,
        includes: [
          'Dual Subwoofers & Line Array Tops',
          'Intelligent Moving Head Stage Lights',
          'Live Dhol Player Accompaniment (1)',
        ],
      },
    ],
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        caption: 'Beachside Sangeet Rave in Vagator',
      },
    ],
    contact: {
      phone: '+91 98333 12900',
      email: 'bookings@djrakesh.com',
      instagram: '@djrakeshlive',
      website: '',
    },
    isVerified: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 74 },
  },
  {
    id: 'v5',
    businessName: 'Glamour & Grace Couture Makeup by Sanjana',
    slug: 'glamour-grace-couture-makeup-sanjana-205',
    category: 'makeup',
    description:
      'Celebrity certified bridal makeup artist with high-definition airbrush expertise using Charlotte Tilbury, Dior, and MAC. Specializes in luminous natural glass skin and royal wedding transformations.',
    avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    location: {
      city: 'Delhi NCR',
      state: 'Delhi',
      serviceAreas: ['Delhi NCR', 'Jaipur', 'Chandigarh', 'Udaipur'],
    },
    experience: 7,
    startingPrice: 35000,
    packages: [
      {
        id: 'p8',
        name: 'HD Signature Bridal Look',
        description: 'Complete bridal makeover for pheras or reception.',
        price: 35000,
        includes: [
          'High Definition Airbrush Base',
          'Hairstyling, Saree/Dupatta Draping',
          'Premium Mink Lashes & Nail Extensions',
        ],
      },
    ],
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        caption: 'Royal Pastel Bridal Makeover',
      },
    ],
    contact: {
      phone: '+91 99990 41238',
      email: 'sanjana@glamourgrace.in',
      instagram: '@sanjanamakeover',
      website: '',
    },
    isVerified: true,
    isFeatured: false,
    ratings: { average: 4.9, count: 98 },
  },
  {
    id: 'v6',
    businessName: 'Swara Rhythm Acoustic & Sufi Ensemble',
    slug: 'swara-rhythm-acoustic-sufi-ensemble-206',
    category: 'band',
    description:
      '6-piece live band blending classical Indian sitar, tabla, soulful sufi vocals, and western acoustic guitars for dreamy cocktail soirees and sunset haldi ceremonies.',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      serviceAreas: ['Jaipur', 'Udaipur', 'Jodhpur', 'Delhi NCR'],
    },
    experience: 10,
    startingPrice: 60000,
    packages: [
      {
        id: 'p9',
        name: 'Sunset Sufi Session (2.5 Hours)',
        description: 'Soulful acoustic performance with sound engineer & setup.',
        price: 60000,
        includes: ['6 Musicians with Instruments', 'Custom Song Requests for Bride Entrance'],
      },
    ],
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        caption: 'Palace Courtyard Sufi Night',
      },
    ],
    contact: {
      phone: '+91 94140 55123',
      email: 'swaraband@gmail.com',
      instagram: '@swaramusic',
      website: '',
    },
    isVerified: true,
    isFeatured: false,
    ratings: { average: 4.8, count: 62 },
  },
];
