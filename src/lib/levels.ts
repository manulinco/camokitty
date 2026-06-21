export const BACKGROUNDS = [
  { id: 'genshin-impact', name: 'Genshin Impact', url: '/backgrounds/bg_genshin_v2.jpg' },
  { id: 'zelda-botw', name: 'Zelda Breath of the Wild', url: '/backgrounds/bg_zelda_v2.jpg' },
  { id: 'minecraft', name: 'Minecraft', url: '/backgrounds/bg_minecraft_v2.jpg' },
  { id: 'animal-crossing', name: 'Animal Crossing', url: '/backgrounds/bg_animalcrossing_v2.jpg' },
  { id: 'mecha-chameleon-base', name: 'Mecha Chameleon Base', url: '/backgrounds/bg_mechachameleon.png' }
];

export const POSES = [
  {
    id: 'pose-stand',
    name: 'Standing Blocky',
    path: 'M 40 10 L 60 10 L 60 30 L 40 30 Z M 35 30 L 65 30 L 65 65 L 35 65 Z M 20 30 L 35 30 L 35 60 L 20 60 Z M 65 30 L 80 30 L 80 60 L 65 60 Z M 35 65 L 48 65 L 48 95 L 35 95 Z M 52 65 L 65 65 L 65 95 L 52 95 Z'
  },
  {
    id: 'pose-tpose',
    name: 'T-Pose',
    path: 'M 40 10 L 60 10 L 60 30 L 40 30 Z M 40 30 L 60 30 L 60 70 L 40 70 Z M 10 30 L 40 30 L 40 45 L 10 45 Z M 60 30 L 90 30 L 90 45 L 60 45 Z M 40 70 L 48 70 L 48 95 L 40 95 Z M 52 70 L 60 70 L 60 95 L 52 95 Z'
  },
  {
    id: 'pose-sit',
    name: 'Sitting Blocky',
    path: 'M 40 20 L 60 20 L 60 40 L 40 40 Z M 40 40 L 60 40 L 60 75 L 40 75 Z M 60 60 L 90 60 L 90 75 L 60 75 Z M 25 40 L 40 40 L 40 70 L 25 70 Z'
  },
  {
    id: 'pose-lay',
    name: 'Laying Flat',
    path: 'M 10 40 L 30 40 L 30 60 L 10 60 Z M 30 40 L 70 40 L 70 60 L 30 60 Z M 70 40 L 95 40 L 95 60 L 70 60 Z M 40 60 L 60 60 L 60 75 L 40 75 Z'
  },
  {
    id: 'pose-wave',
    name: 'Waving Blocky',
    path: 'M 40 10 L 60 10 L 60 30 L 40 30 Z M 35 30 L 65 30 L 65 65 L 35 65 Z M 65 30 L 80 30 L 80 60 L 65 60 Z M 20 10 L 35 10 L 35 40 L 20 40 Z M 35 65 L 48 65 L 48 95 L 35 95 Z M 52 65 L 65 65 L 65 95 L 52 95 Z'
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
