// ===========================================
// VIBE DATA
// To add a vibe: copy one object below, fill
// in the fields, and the site auto-renders it.
// ===========================================
const vibes = [
  {
    id: 'neon-dystopia',
    name: 'Neon Dystopia',
    genre: 'sci-fi',
    mood: 'intense',
    emotion: 'awe, unease',
    energy: 'high',
    tempo: 'fast',
    tempoBpm: '110–130 BPM',
    description: 'Rain-slick streets, holographic ads, and the hum of a city that never sleeps. Built for cyberpunk, tech-noir, and dystopian sci-fi edits.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80',
    colors: ['#0D0221','#1A0533','#FF2079','#00F5D4','#FFE74C','#080B2E'],
    music: [
      { name: 'Cyber Pulse', artist: 'SoundRaw Studio', genre: 'Electronic', bpm: 124, license: 'CC0', source: 'Pixabay Music', url: 'https://pixabay.com/music/' },
      { name: 'Neural Static', artist: 'Audionautix', genre: 'Ambient Electronic', bpm: 110, license: 'CC BY', source: 'Free Music Archive', url: 'https://freemusicarchive.org' },
    ],
    sfx: [
      { name: 'City Rain Ambience Loop', category: 'Environment', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Electric Hum / Server Room', category: 'Ambience', source: 'Zapsplat', url: 'https://zapsplat.com' },
      { name: 'Neon Sign Buzz', category: 'Foley', source: 'Freesound', url: 'https://freesound.org' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    ]
  },
  {
    id: 'nordic-noir',
    name: 'Nordic Noir',
    genre: 'thriller',
    mood: 'dark',
    emotion: 'dread, isolation',
    energy: 'low',
    tempo: 'slow',
    tempoBpm: '55–75 BPM',
    description: 'Frozen landscapes, long shadows, and silence that speaks. For slow-burn thrillers, crime dramas, and atmospheric northern stories.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
    colors: ['#0A0E1A','#1C2B3A','#2E4057','#4A6FA5','#8FA8C8','#B8C9D9'],
    music: [
      { name: 'Glacial Tension', artist: 'Kevin MacLeod', genre: 'Orchestral', bpm: 60, license: 'CC BY', source: 'Incompetech', url: 'https://incompetech.com' },
      { name: 'Midnight Frost', artist: 'Various', genre: 'Ambient', bpm: 66, license: 'CC0', source: 'Pixabay Music', url: 'https://pixabay.com/music/' },
    ],
    sfx: [
      { name: 'Winter Wind Howl', category: 'Environment', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
      { name: 'Footsteps on Snow', category: 'Foley', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Distant Church Bell', category: 'Ambience', source: 'Zapsplat', url: 'https://zapsplat.com' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=400&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    ]
  },
  {
    id: 'golden-hour-romance',
    name: 'Golden Hour Romance',
    genre: 'romance',
    mood: 'warm',
    emotion: 'longing, joy',
    energy: 'medium',
    tempo: 'mid',
    tempoBpm: '80–100 BPM',
    description: 'Dust motes in amber light, slow smiles, and the ache of a perfect moment. For romantic dramas, wedding films, and nostalgic love stories.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80',
    colors: ['#2C1810','#6B3522','#C06030','#E8823A','#F5C842','#FFF0D0'],
    music: [
      { name: 'Bittersweet Reverie', artist: 'Scott Buckley', genre: 'Acoustic / Orchestral', bpm: 84, license: 'CC BY', source: 'Free Music Archive', url: 'https://freemusicarchive.org' },
      { name: 'Warm Afternoon', artist: 'Various', genre: 'Acoustic', bpm: 92, license: 'CC0', source: 'Pixabay Music', url: 'https://pixabay.com/music/' },
    ],
    sfx: [
      { name: 'Crickets & Summer Evening', category: 'Environment', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
      { name: 'Gentle Breeze through Grass', category: 'Environment', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Distant Train Whistle', category: 'Ambience', source: 'Zapsplat', url: 'https://zapsplat.com' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=400&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
    ]
  },
  {
    id: 'indie-folk-road',
    name: 'Indie Folk Road',
    genre: 'indie',
    mood: 'nostalgic',
    emotion: 'freedom, melancholy',
    energy: 'medium',
    tempo: 'mid',
    tempoBpm: '90–110 BPM',
    description: 'Open highways, faded polaroids, and the feeling of leaving something behind. For road movies, coming-of-age stories, and quiet human dramas.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    colors: ['#1A1208','#3D2B1F','#7A5C40','#B89060','#D4B483','#F0DEB8'],
    music: [
      { name: 'Open Road Strumming', artist: 'Various Artists', genre: 'Folk / Acoustic', bpm: 98, license: 'CC BY', source: 'ccMixter', url: 'https://ccmixter.org' },
      { name: 'Prairie Dusk', artist: 'Kevin MacLeod', genre: 'Country Folk', bpm: 104, license: 'CC BY', source: 'Incompetech', url: 'https://incompetech.com' },
    ],
    sfx: [
      { name: 'Highway Car Pass Ambience', category: 'Environment', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Campfire Crackling', category: 'Ambience', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
      { name: 'Vinyl Record Crackle', category: 'Foley', source: 'Freesound', url: 'https://freesound.org' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&q=80',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=80',
    ]
  },
  {
    id: 'cosmic-horror',
    name: 'Cosmic Horror',
    genre: 'horror',
    mood: 'dark',
    emotion: 'dread, insignificance',
    energy: 'low',
    tempo: 'slow',
    tempoBpm: '40–65 BPM',
    description: 'The void stares back. Vast, unknowable, ancient. For psychological horror, body horror, Lovecraftian narratives, and existential dread sequences.',
    image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=900&q=80',
    colors: ['#050510','#0C0520','#1A0A2E','#3B1060','#6B21A8','#E879F9'],
    music: [
      { name: 'Abyss Drone', artist: 'Various', genre: 'Dark Ambient', bpm: 48, license: 'CC0', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'The Deep Void', artist: 'Kevin MacLeod', genre: 'Orchestral Horror', bpm: 56, license: 'CC BY', source: 'Incompetech', url: 'https://incompetech.com' },
    ],
    sfx: [
      { name: 'Low Rumble / Sub Drone', category: 'Impact', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Reversed Choir Swell', category: 'Transition', source: 'Zapsplat', url: 'https://zapsplat.com' },
      { name: 'Deep Cave Ambience', category: 'Environment', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80',
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
    ]
  },
  {
    id: 'luxury-minimal',
    name: 'Luxury Minimal',
    genre: 'luxury',
    mood: 'calm',
    emotion: 'sophistication, desire',
    energy: 'low',
    tempo: 'slow',
    tempoBpm: '60–80 BPM',
    description: 'Cold marble, warm champagne, and unhurried silence. For high-end brand films, luxury fashion content, and aspirational lifestyle edits.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    colors: ['#0A0A0A','#1A1A1A','#8B7355','#C4A882','#E8D5B7','#F5F0E8'],
    music: [
      { name: 'Prestige Ambient', artist: 'Various', genre: 'Piano Ambient', bpm: 68, license: 'CC0', source: 'Pixabay Music', url: 'https://pixabay.com/music/' },
      { name: 'Velvet Hour', artist: 'Scott Buckley', genre: 'Orchestral', bpm: 72, license: 'CC BY', source: 'Free Music Archive', url: 'https://freemusicarchive.org' },
    ],
    sfx: [
      { name: 'Champagne Pop & Pour', category: 'Foley', source: 'Zapsplat', url: 'https://zapsplat.com' },
      { name: 'Quiet Atelier Ambience', category: 'Ambience', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Subtle String Riser', category: 'Transition', source: 'Freesound', url: 'https://freesound.org' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    ]
  },
  {
    id: 'high-octane-action',
    name: 'High Octane Action',
    genre: 'action',
    mood: 'intense',
    emotion: 'adrenaline, power',
    energy: 'high',
    tempo: 'fast',
    tempoBpm: '130–160 BPM',
    description: 'Pulse-pounding cuts, iron and smoke, the world at full tilt. For chase sequences, fight reels, sports montages, and trailers.',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=900&q=80',
    colors: ['#0D0000','#1A0000','#8B0000','#C0392B','#E74C3C','#FF8C00'],
    music: [
      { name: 'Impact Drive', artist: 'Various', genre: 'Trailer / Action', bpm: 148, license: 'CC0', source: 'Pixabay Music', url: 'https://pixabay.com/music/' },
      { name: 'Overdrive', artist: 'Audionautix', genre: 'Electronic Rock', bpm: 138, license: 'CC BY', source: 'Free Music Archive', url: 'https://freemusicarchive.org' },
    ],
    sfx: [
      { name: 'Punch Impact Whoosh', category: 'Impact', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Tire Screech & Crash', category: 'Foley', source: 'Zapsplat', url: 'https://zapsplat.com' },
      { name: 'Explosion with Debris', category: 'Impact', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    ]
  },
  {
    id: 'survival-horror',
    name: 'Survival Horror',
    genre: 'horror',
    mood: 'suspenseful',
    emotion: 'fear, desperation',
    energy: 'high',
    tempo: 'fast',
    tempoBpm: '100–140 BPM',
    description: 'Heartbeat in your ears, shadows closing in, nowhere left to run. For survival horror, slasher films, and relentless chase sequences where every second counts.',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=900&q=80',
    colors: ['#0A0000','#1C0808','#3D1010','#6B2020','#A03030','#CC5050'],
    music: [
      { name: 'Dread Pulse', artist: 'Various', genre: 'Dark Ambient', bpm: 118, license: 'CC0', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Chase Sequence', artist: 'Kevin MacLeod', genre: 'Orchestral Horror', bpm: 138, license: 'CC BY', source: 'Incompetech', url: 'https://incompetech.com' },
    ],
    sfx: [
      { name: 'Heartbeat Loop', category: 'Foley', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Door Creak & Slam', category: 'Foley', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
      { name: 'Heavy Panicked Breathing', category: 'Foley', source: 'Zapsplat', url: 'https://zapsplat.com' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80',
      'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=400&q=80',
    ]
  },
  {
    id: 'dusty-western',
    name: 'Dusty Western',
    genre: 'western',
    mood: 'suspenseful',
    emotion: 'tension, rugged freedom',
    energy: 'medium',
    tempo: 'mid',
    tempoBpm: '85–110 BPM',
    description: 'Sun-bleached plains, standoffs, and a score that raises the stakes. For westerns, neo-westerns, and frontier adventure stories.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80',
    colors: ['#1A0E00','#3D2200','#7A4A10','#B87A30','#D4A055','#F0D090'],
    music: [
      { name: 'Frontier Standoff', artist: 'Kevin MacLeod', genre: 'Western / Orchestral', bpm: 96, license: 'CC BY', source: 'Incompetech', url: 'https://incompetech.com' },
      { name: 'Desert Horizon', artist: 'Various', genre: 'Folk Western', bpm: 102, license: 'CC0', source: 'Pixabay Music', url: 'https://pixabay.com/music/' },
    ],
    sfx: [
      { name: 'Howling Dust Wind', category: 'Environment', source: 'BBC SFX', url: 'https://sound-effects.bbcrewind.co.uk' },
      { name: 'Spurs on Wooden Floor', category: 'Foley', source: 'Freesound', url: 'https://freesound.org' },
      { name: 'Distant Coyote Howl', category: 'Ambience', source: 'Freesound', url: 'https://freesound.org' },
    ],
    refs: [
      'https://images.unsplash.com/photo-1496436672849-95f8adb7b7ab?w=400&q=80',
      'https://images.unsplash.com/photo-1512053459797-38c3a066cabd?w=400&q=80',
    ]
  },
];
