import { GAME_CONFIG, UPGRADE_CONFIG } from '../config/gameConfig';

// Calculate wing lift based on upgrade level
export const getWingLift = (wingLevel) => {
  return GAME_CONFIG.plane.baseLift * (1 + wingLevel * UPGRADE_CONFIG.wing.effectPerLevel);
};

// Calculate fuel efficiency based on upgrade level
export const getFuelEfficiency = (fuelLevel) => {
  return 1 + fuelLevel * UPGRADE_CONFIG.fuel.effectPerLevel;
};

// Calculate upgrade cost based on level
export const getUpgradeCost = (type, level) => {
  const config = UPGRADE_CONFIG[type];
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, level - 1));
};

// Check collision between plane and obstacle
export const checkCollision = (plane, obstacle) => {
  const planeSize = GAME_CONFIG.plane.size;
  const buffer = GAME_CONFIG.collision.buffer;
  
  // Check horizontal overlap
  if (plane.x + planeSize - buffer < obstacle.x || 
      plane.x + buffer > obstacle.x + obstacle.width) {
    return false;
  }
  
  // Check vertical collision (hit top or bottom pipe)
  if (plane.y + buffer < obstacle.topHeight || 
      plane.y + planeSize - buffer > obstacle.topHeight + obstacle.gap) {
    return true;
  }
  
  return false;
};

// Generate a new obstacle
export const generateObstacle = (canvasWidth) => {
  const gap = GAME_CONFIG.obstacle.minGap + 
               Math.random() * (GAME_CONFIG.obstacle.maxGap - GAME_CONFIG.obstacle.minGap);
  const topHeight = 50 + Math.random() * (GAME_CONFIG.canvas.height - gap - 100);
  
  return {
    x: canvasWidth,
    topHeight,
    gap,
    width: GAME_CONFIG.obstacle.width,
    passed: false
  };
};