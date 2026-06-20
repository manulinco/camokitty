export const BACKGROUNDS = [
  // Anime
  { id: 'doraemon-nobita-room', name: 'Nobita\'s Room', url: '/backgrounds/bg_doraemon.png' },
  { id: 'spirited-away-boiler-room', name: 'Kamaji\'s Boiler Room', url: '/backgrounds/bg_spirited.png' },
  { id: 'howls-moving-castle-bedroom', name: 'Howl\'s Bedroom', url: '/backgrounds/bg_howl.png' },
  { id: 'naruto-ichiraku-ramen', name: 'Ichiraku Ramen', url: '/backgrounds/bg_naruto.png' },
  { id: 'one-piece-thousand-sunny-deck', name: 'Thousand Sunny Deck', url: '/backgrounds/bg_onepiece.png' },
  { id: 'attack-on-titan-shiganshina', name: 'Shiganshina District', url: '/backgrounds/bg_aot.png' },
  { id: 'demon-slayer-infinity-castle', name: 'Infinity Castle', url: '/backgrounds/bg_demonslayer.png' },
  
  // Gaming
  { id: 'cyberpunk-2077-night-city-street', name: 'Night City Street', url: '/backgrounds/bg_cyberpunk.png' },
  { id: 'elden-ring-roundtable-hold', name: 'Roundtable Hold', url: '/backgrounds/bg_eldenring.png' },
  { id: 'genshin-impact-mondstadt-tavern', name: 'Angel\'s Share Tavern', url: '/backgrounds/bg_genshin.png' },
  { id: 'animal-crossing-nooks-cranny', name: 'Nook\'s Cranny', url: '/backgrounds/bg_animalcrossing.png' },
  { id: 'stardew-valley-pierre-shop', name: 'Pierre\'s General Store', url: '/backgrounds/bg_stardew.png' },
  { id: 'minecraft-villager-house', name: 'Villager House', url: '/backgrounds/bg_minecraft.png' },
  { id: 'zelda-botw-link-house', name: 'Link\'s House', url: '/backgrounds/bg_zelda.png' },
  
  // Cartoons
  { id: 'rick-and-morty-garage', name: 'Rick\'s Garage', url: '/backgrounds/bg_rickandmorty.png' },
  { id: 'spongebob-pineapple-house', name: 'Pineapple House', url: '/backgrounds/bg_spongebob.png' },
  { id: 'simpsons-living-room', name: 'Simpsons Living Room', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop' },
  { id: 'gravity-falls-mystery-shack', name: 'Mystery Shack', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop' },
  
  // Movies
  { id: 'harry-potter-gryffindor-room', name: 'Gryffindor Common Room', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop' },
  { id: 'star-wars-millennium-falcon', name: 'Millennium Falcon Cockpit', url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1000&auto=format&fit=crop' }
];

export const POSES = [
  { 
    id: 'pose-sit', 
    name: 'Sitting',
    path: 'M 80 70 Q 95 60 90 40 Q 85 20 75 35 Q 70 45 75 60 Z M 30 80 Q 50 85 70 80 L 75 50 Q 50 40 25 50 Z' 
  },
  { 
    id: 'pose-curl', 
    name: 'Curled Up',
    // A croissant/circle shape with ears
    path: 'M 30 60 C 20 30 80 30 70 60 C 60 90 40 90 30 60 Z M 40 40 L 35 25 L 50 35 M 60 40 L 65 25 L 50 35' 
  },
  { 
    id: 'pose-stretch', 
    name: 'Stretched Out',
    // Long pill shape
    path: 'M 20 40 L 80 40 C 90 40 90 60 80 60 L 20 60 C 10 60 10 40 20 40 Z M 25 40 L 20 25 L 35 35 M 75 40 L 80 25 L 65 35' 
  },
  { 
    id: 'pose-belly', 
    name: 'Belly Up',
    // Rounded bottom, 4 legs pointing up
    path: 'M 20 60 Q 50 80 80 60 L 80 40 Q 50 20 20 40 Z M 30 45 L 30 20 M 45 50 L 45 20 M 55 50 L 55 20 M 70 45 L 70 20 M 20 50 L 10 30 L 30 40 M 80 50 L 90 30 L 70 40' 
  },
  { 
    id: 'pose-sploot', 
    name: 'Splooting',
    // Flat belly, legs out sideways
    path: 'M 20 40 Q 50 30 80 40 L 80 60 Q 50 70 20 60 Z M 25 45 L 5 45 M 75 45 L 95 45 M 35 60 L 25 80 M 65 60 L 75 80 M 50 35 L 40 20 L 55 30' 
  },
  { 
    id: 'pose-hang', 
    name: 'Hanging',
    // One arm extended up, body hanging down
    path: 'M 50 20 L 50 50 M 40 50 Q 40 90 50 90 Q 60 90 60 50 Z M 45 30 L 30 20 L 40 40 M 55 30 L 70 20 L 60 40 M 45 80 L 30 90 M 55 80 L 70 90' 
  }
];

export function getRandomLevel(bgId?: string) {
  let bg;
  if (bgId) {
    bg = BACKGROUNDS.find(b => b.id === bgId);
  }
  if (!bg) {
    bg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  }
  
  const pose = POSES[Math.floor(Math.random() * POSES.length)];
  const rotation = Math.floor(Math.random() * 360);
  return { bg, pose, rotation };
}
