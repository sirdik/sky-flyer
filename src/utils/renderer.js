import { GAME_CONFIG, COLORS } from '../config/gameConfig';

// Draw the sky background
export const drawSky = (ctx) => {
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
};

// Draw animated clouds
export const drawClouds = (ctx, frameCount) => {
  ctx.fillStyle = COLORS.cloud;
  for (let i = 0; i < 5; i++) {
    const x = (frameCount * 0.5 + i * 200) % (GAME_CONFIG.canvas.width + 100);
    const y = 100 + i * 80;
    
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 40, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.fill();
  }
};

// Draw the plane
export const drawPlane = (ctx, plane) => {
  ctx.save();
  ctx.translate(
    plane.x + GAME_CONFIG.plane.size / 2, 
    plane.y + GAME_CONFIG.plane.size / 2
  );
  ctx.rotate(plane.rotation * Math.PI / 180);
  
  // Plane body
  ctx.fillStyle = COLORS.plane.body;
  ctx.fillRect(-20, -8, 35, 16);
  
  // Wings
  ctx.fillStyle = COLORS.plane.wings;
  ctx.fillRect(-10, -20, 25, 8);
  ctx.fillRect(-10, 12, 25, 8);
  
  // Nose
  ctx.fillStyle = COLORS.plane.nose;
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(25, -5);
  ctx.lineTo(25, 5);
  ctx.closePath();
  ctx.fill();
  
  // Window
  ctx.fillStyle = COLORS.plane.window;
  ctx.fillRect(0, -5, 10, 10);
  
  ctx.restore();
};

// Draw a flying plane obstacle (top)
const drawFlyingPlane = (ctx, x, y, width) => {
  const planeWidth = width * 1.2;
  const planeHeight = width * 0.6;
  
  ctx.save();
  ctx.translate(x + width / 2, y);
  
  // Plane body
  ctx.fillStyle = '#4B5563';
  ctx.fillRect(-planeWidth / 2, -planeHeight / 2, planeWidth * 0.7, planeHeight);
  
  // Wings
  ctx.fillStyle = '#6B7280';
  ctx.fillRect(-planeWidth / 2 - 5, -planeHeight / 2 - 8, planeWidth * 0.6, 8);
  ctx.fillRect(-planeWidth / 2 - 5, planeHeight / 2, planeWidth * 0.6, 8);
  
  // Tail
  ctx.fillStyle = '#9CA3AF';
  ctx.fillRect(-planeWidth / 2 - planeWidth * 0.15, -planeHeight / 3, planeWidth * 0.15, planeHeight * 0.66);
  
  // Nose
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.moveTo(planeWidth / 2 - planeWidth * 0.3, 0);
  ctx.lineTo(planeWidth / 2, -planeHeight / 4);
  ctx.lineTo(planeWidth / 2, planeHeight / 4);
  ctx.closePath();
  ctx.fill();
  
  // Windows
  ctx.fillStyle = '#60A5FA';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-planeWidth / 4 + i * 10, -planeHeight / 4, 6, 6);
  }
  
  ctx.restore();
};

// Draw a castle tower (bottom)
const drawCastleTower = (ctx, x, y, width, height) => {
  // Main tower body - darker stone
  ctx.fillStyle = '#57534E';
  ctx.fillRect(x, y, width, height);
  
  // Stone texture lines
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 2;
  for (let i = 0; i < height; i += 15) {
    ctx.beginPath();
    ctx.moveTo(x, y + i);
    ctx.lineTo(x + width, y + i);
    ctx.stroke();
  }
  
  // Vertical lines for stone blocks
  for (let i = 0; i < width; i += 20) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i, y + height);
    ctx.stroke();
  }
  
  // Battlements (top) - lighter color
  ctx.fillStyle = '#78716C';
  const battlementWidth = width / 5;
  for (let i = 0; i < 5; i += 2) {
    ctx.fillRect(x + i * battlementWidth, y - 10, battlementWidth, 10);
  }
  
  // Window with yellow light
  ctx.fillStyle = '#FCD34D';
  ctx.fillRect(x + width / 2 - 6, y + 20, 12, 16);
  
  // Window frame
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + width / 2 - 6, y + 20, 12, 16);
  
  // Door at bottom
  ctx.fillStyle = '#1C1917';
  ctx.fillRect(x + width / 2 - 8, y + height - 25, 16, 25);
  
  // Door frame
  ctx.strokeStyle = '#44403C';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + width / 2 - 8, y + height - 25, 16, 25);
};

// Draw a church tower (bottom)
const drawChurchTower = (ctx, x, y, width, height) => {
  // Main tower body
  ctx.fillStyle = '#E7E5E4';
  ctx.fillRect(x, y, width, height);
  
  // Tower top (pointed roof)
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - 20);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fill();
  
  // Cross on top
  ctx.fillStyle = '#FCD34D';
  ctx.fillRect(x + width / 2 - 2, y - 35, 4, 20);
  ctx.fillRect(x + width / 2 - 6, y - 30, 12, 4);
  
  // Windows
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(x + width / 2 - 8, y + 20, 16, 20);
  ctx.fillRect(x + width / 2 - 8, y + 50, 16, 20);
  
  // Door
  ctx.fillStyle = '#92400E';
  ctx.fillRect(x + width / 2 - 10, y + height - 25, 20, 25);
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height - 25, 10, Math.PI, 0);
  ctx.fill();
};

// Draw a TV tower (bottom)
const drawTVTower = (ctx, x, y, width, height) => {
  // Main tower structure (tapered)
  ctx.fillStyle = '#6B7280';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.3, y + height);
  ctx.lineTo(x + width * 0.4, y);
  ctx.lineTo(x + width * 0.6, y);
  ctx.lineTo(x + width * 0.7, y + height);
  ctx.closePath();
  ctx.fill();
  
  // Cross beams
  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const yPos = y + (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.3 + (height - (yPos - y)) * 0.1, yPos);
    ctx.lineTo(x + width * 0.7 - (height - (yPos - y)) * 0.1, yPos);
    ctx.stroke();
  }
  
  // Antenna on top
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(x + width / 2 - 2, y - 30, 4, 30);
  
  // Red light on antenna
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(x + width / 2, y - 32, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Satellite dishes
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + width * 0.45, y + height / 3, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + width * 0.55, y + height / 2, 8, 0, Math.PI * 2);
  ctx.stroke();
};

// Draw an obstacle
export const drawObstacle = (ctx, obstacle) => {
  // Draw top obstacle (flying plane)
  drawFlyingPlane(ctx, obstacle.x, obstacle.topHeight - 20, obstacle.width);
  
  // Draw bottom obstacle (random tower type)
  const bottomY = obstacle.topHeight + obstacle.gap;
  const bottomHeight = GAME_CONFIG.canvas.height - bottomY;
  
  // Ensure towerType is set and valid
  if (obstacle.towerType === undefined || obstacle.towerType === null) {
    obstacle.towerType = Math.floor(Math.random() * 3);
  }
  
  // Draw the appropriate tower type
  if (obstacle.towerType === 0) {
    drawCastleTower(ctx, obstacle.x, bottomY, obstacle.width, bottomHeight);
  } else if (obstacle.towerType === 1) {
    drawChurchTower(ctx, obstacle.x, bottomY, obstacle.width, bottomHeight);
  } else if (obstacle.towerType === 2) {
    drawTVTower(ctx, obstacle.x, bottomY, obstacle.width, bottomHeight);
  } else {
    // Fallback to castle if something goes wrong
    drawCastleTower(ctx, obstacle.x, bottomY, obstacle.width, bottomHeight);
  }
};