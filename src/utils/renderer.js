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

// Draw an obstacle (pipe)
export const drawObstacle = (ctx, obstacle) => {
  // Draw pipes
  ctx.fillStyle = COLORS.obstacle.pipe;
  ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
  ctx.fillRect(
    obstacle.x, 
    obstacle.topHeight + obstacle.gap, 
    obstacle.width, 
    GAME_CONFIG.canvas.height - obstacle.topHeight - obstacle.gap
  );
  
  // Draw caps
  ctx.fillStyle = COLORS.obstacle.cap;
  ctx.fillRect(obstacle.x - 5, obstacle.topHeight - 20, obstacle.width + 10, 20);
  ctx.fillRect(obstacle.x - 5, obstacle.topHeight + obstacle.gap, obstacle.width + 10, 20);
};