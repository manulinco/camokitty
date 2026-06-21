export const BACKGROUNDS = [
  // Realistic
  { id: 'bg-livingroom', name: 'Messy Living Room', url: '/backgrounds/bg_livingroom.png' },
  { id: 'bg-bookshelf', name: 'Wooden Bookshelf', url: '/backgrounds/bg_bookshelf.png' },
  { id: 'bg-kitchen', name: 'Kitchen Counter', url: '/backgrounds/bg_kitchen.png' },
  { id: 'bg-park', name: 'Autumn Park', url: '/backgrounds/bg_park.png' },
  
  // Keep one mecha chameleon as user asked for it before
  { id: 'mecha-chameleon-base', name: 'Mecha Chameleon Base', url: '/backgrounds/bg_mechachameleon.png' }
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
