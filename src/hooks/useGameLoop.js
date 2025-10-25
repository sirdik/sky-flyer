import { useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import { checkCollision, generateObstacle, getWingLift, getFuelEfficiency } from '../utils/gameUtils';
import { drawSky, drawClouds, drawPlane, drawObstacle } from '../utils/renderer';

export const useGameLoop = (
  canvasRef,
  gameState,
  wingLevel,
  fuelLevel,
  onScoreUpdate,
  onCoinsUpdate,
  onGameOver
) => {
  const gameLoopRef = useRef(null);
  const gameStateRef = useRef({
    plane: { x: 100, y: 300, velocity: 0, rotation: 0 },
    obstacles: [],
    frameCount: 0,
    keys: { up: false, down: false },
    lastObstacleFrame: 0,
    airTime: 0
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = true;
      if (e.key === 'w') gameStateRef.current.keys.up = true;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = true;
      if (e.key === 's') gameStateRef.current.keys.down = true;
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = false;
      if (e.key === 'w') gameStateRef.current.keys.up = false;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = false;
      if (e.key === 's') gameStateRef.current.keys.down = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const gs = gameStateRef.current;
    
    // Clear and draw background
    drawSky(ctx);
    drawClouds(ctx, gs.frameCount);
    
    // Update plane physics
    const { up, down } = gs.keys;
    const gravity = GAME_CONFIG.plane.baseGravity;
    const lift = getWingLift(wingLevel);
    
    if (up) {
      gs.plane.velocity += lift;
    } else if (down) {
      gs.plane.velocity += gravity * 1.5;
    } else {
      gs.plane.velocity += gravity;
    }
    
    // Clamp velocity
    gs.plane.velocity = Math.max(
      -GAME_CONFIG.plane.maxSpeed, 
      Math.min(GAME_CONFIG.plane.maxSpeed, gs.plane.velocity)
    );
    
    gs.plane.y += gs.plane.velocity;
    gs.plane.rotation = gs.plane.velocity * 3;
    
    // Check boundaries
    if (gs.plane.y < 0 || gs.plane.y + GAME_CONFIG.plane.size > GAME_CONFIG.canvas.height) {
      onGameOver();
      return;
    }
    
    // Draw plane
    drawPlane(ctx, gs.plane);
    
    // Spawn obstacles
    if (gs.frameCount - gs.lastObstacleFrame > GAME_CONFIG.obstacle.spawnInterval) {
      gs.obstacles.push(generateObstacle(GAME_CONFIG.canvas.width));
      gs.lastObstacleFrame = gs.frameCount;
    }
    
    // Update and draw obstacles
    gs.obstacles = gs.obstacles.filter(obstacle => {
      obstacle.x -= GAME_CONFIG.obstacle.speed * getFuelEfficiency(fuelLevel);
      
      // Check collision
      if (checkCollision(gs.plane, obstacle)) {
        onGameOver();
        return false;
      }
      
      // Score points
      if (!obstacle.passed && obstacle.x + obstacle.width < gs.plane.x) {
        obstacle.passed = true;
        onScoreUpdate(prev => prev + 1);
      }
      
      // Draw obstacle
      drawObstacle(ctx, obstacle);
      
      return obstacle.x + obstacle.width > -50;
    });
    
    // Update airtime and coins
    gs.airTime += 1/60;
    if (gs.frameCount % GAME_CONFIG.coins.earnInterval === 0) {
      onCoinsUpdate(prev => prev + 1);
    }
    
    gs.frameCount++;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, wingLevel, fuelLevel, canvasRef, onScoreUpdate, onCoinsUpdate, onGameOver]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Reset game state
  const resetGame = useCallback(() => {
    gameStateRef.current = {
      plane: { x: 100, y: 300, velocity: 0, rotation: 0 },
      obstacles: [],
      frameCount: 0,
      keys: { up: false, down: false },
      lastObstacleFrame: 0,
      airTime: 0
    };
  }, []);

  return { resetGame };
};