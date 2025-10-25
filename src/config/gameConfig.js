// Game configuration constants
export const GAME_CONFIG = {
  canvas: { 
    width: 800, 
    height: 600 
  },
  plane: { 
    size: 40,
    baseGravity: 0.12,
    baseLift: -0.2,
    maxSpeed: 3
  },
  obstacle: {
    width: 50,
    minGap: 250,
    maxGap: 350,
    speed: 2,
    spawnInterval: 100  // frames between obstacles
  },
  collision: {
    buffer: 5  // collision forgiveness in pixels
  },
  coins: {
    earnInterval: 30  // frames between earning coins (30 = 0.5 seconds at 60fps)
  }
};

// Upgrade configuration
export const UPGRADE_CONFIG = {
  wing: {
    baseCost: 50,
    costMultiplier: 1.25,
    effectPerLevel: 0.15  // 15% improvement per level
  },
  fuel: {
    baseCost: 40,
    costMultiplier: 1.25,
    effectPerLevel: 0.2  // 20% improvement per level
  }
};

// Visual configuration
export const COLORS = {
  sky: '#87CEEB',
  cloud: 'rgba(255, 255, 255, 0.6)',
  plane: {
    body: '#101cc7ff',
    wings: '#07811bff',
    nose: '#d11010ff',
    window: '#4169E1'
  },
  obstacle: {
    pipe: '#228B22',
    cap: '#32CD32'
  }
};