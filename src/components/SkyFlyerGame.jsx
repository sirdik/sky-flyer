import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plane, TrendingUp, Fuel, Settings } from 'lucide-react';

const SkyFlyerGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, shop, gameover
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Upgrades
  const [wingLevel, setWingLevel] = useState(1);
  const [fuelLevel, setFuelLevel] = useState(1);
  
  // Game objects state
  const gameStateRef = useRef({
    plane: { x: 100, y: 300, velocity: 0, rotation: 0 },
    obstacles: [],
    frameCount: 0,
    keys: { up: false, down: false },
    lastObstacleFrame: 0,
    airTime: 0
  });

  const GAME_CONFIG = {
    canvas: { width: 800, height: 600 },
    plane: { 
      size: 40,
      baseGravity: 0.15,
      baseLift: -0.2,
      maxSpeed: 4
    },
    obstacle: {
      width: 50,
      minGap: 200,
      maxGap: 300,
      speed: 2,
      spawnInterval: 90
    }
  };

  // Calculate upgrade effects
  const getWingLift = () => GAME_CONFIG.plane.baseLift * (1 + wingLevel * 0.15);
  const getFuelEfficiency = () => 1 + fuelLevel * 0.2;
  
  const upgradeCosts = {
    wing: Math.floor(50 * Math.pow(1.5, wingLevel - 1)),
    fuel: Math.floor(40 * Math.pow(1.5, fuelLevel - 1))
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = true;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = true;
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') gameStateRef.current.keys.up = false;
      if (e.key === 'ArrowDown') gameStateRef.current.keys.down = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const checkCollision = (plane, obstacle) => {
    const planeSize = GAME_CONFIG.plane.size;
    const buffer = 5;
    
    if (plane.x + planeSize - buffer < obstacle.x || 
        plane.x + buffer > obstacle.x + obstacle.width) {
      return false;
    }
    
    if (plane.y + buffer < obstacle.topHeight || 
        plane.y + planeSize - buffer > obstacle.topHeight + obstacle.gap) {
      return true;
    }
    
    return false;
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    
    const ctx = canvas.getContext('2d');
    const gs = gameStateRef.current;
    
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 5; i++) {
      const x = (gs.frameCount * 0.5 + i * 200) % (GAME_CONFIG.canvas.width + 100);
      ctx.beginPath();
      ctx.arc(x, 100 + i * 80, 30, 0, Math.PI * 2);
      ctx.arc(x + 25, 100 + i * 80, 40, 0, Math.PI * 2);
      ctx.arc(x + 50, 100 + i * 80, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Update plane physics
    const { up, down } = gs.keys;
    const gravity = GAME_CONFIG.plane.baseGravity;
    const lift = getWingLift();
    
    if (up) {
      gs.plane.velocity += lift;
    } else if (down) {
      gs.plane.velocity += gravity * 1.5;
    } else {
      gs.plane.velocity += gravity;
    }
    
    gs.plane.velocity = Math.max(-GAME_CONFIG.plane.maxSpeed, 
                                  Math.min(GAME_CONFIG.plane.maxSpeed, gs.plane.velocity));
    gs.plane.y += gs.plane.velocity;
    gs.plane.rotation = gs.plane.velocity * 3;
    
    // Boundary check
    if (gs.plane.y < 0 || gs.plane.y + GAME_CONFIG.plane.size > GAME_CONFIG.canvas.height) {
      endGame();
      return;
    }
    
    // Draw plane
    ctx.save();
    ctx.translate(gs.plane.x + GAME_CONFIG.plane.size / 2, gs.plane.y + GAME_CONFIG.plane.size / 2);
    ctx.rotate(gs.plane.rotation * Math.PI / 180);
    
    // Plane body
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(-20, -8, 35, 16);
    
    // Wings
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(-10, -20, 25, 8);
    ctx.fillRect(-10, 12, 25, 8);
    
    // Nose
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -5);
    ctx.lineTo(25, 5);
    ctx.closePath();
    ctx.fill();
    
    // Window
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(0, -5, 10, 10);
    
    ctx.restore();
    
    // Spawn obstacles
    if (gs.frameCount - gs.lastObstacleFrame > GAME_CONFIG.obstacle.spawnInterval) {
      const gap = GAME_CONFIG.obstacle.minGap + 
                   Math.random() * (GAME_CONFIG.obstacle.maxGap - GAME_CONFIG.obstacle.minGap);
      const topHeight = 50 + Math.random() * (GAME_CONFIG.canvas.height - gap - 100);
      
      gs.obstacles.push({
        x: GAME_CONFIG.canvas.width,
        topHeight,
        gap,
        width: GAME_CONFIG.obstacle.width,
        passed: false
      });
      gs.lastObstacleFrame = gs.frameCount;
    }
    
    // Update and draw obstacles
    gs.obstacles = gs.obstacles.filter(obstacle => {
      obstacle.x -= GAME_CONFIG.obstacle.speed * getFuelEfficiency();
      
      // Check collision
      if (checkCollision(gs.plane, obstacle)) {
        endGame();
        return false;
      }
      
      // Score points
      if (!obstacle.passed && obstacle.x + obstacle.width < gs.plane.x) {
        obstacle.passed = true;
        setScore(s => s + 1);
      }
      
      // Draw obstacle
      ctx.fillStyle = '#228B22';
      ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
      ctx.fillRect(obstacle.x, obstacle.topHeight + obstacle.gap, 
                   obstacle.width, GAME_CONFIG.canvas.height - obstacle.topHeight - obstacle.gap);
      
      // Draw caps
      ctx.fillStyle = '#32CD32';
      ctx.fillRect(obstacle.x - 5, obstacle.topHeight - 20, obstacle.width + 10, 20);
      ctx.fillRect(obstacle.x - 5, obstacle.topHeight + obstacle.gap, obstacle.width + 10, 20);
      
      return obstacle.x + obstacle.width > -50;
    });
    
    // Update airtime and coins
    gs.airTime += 1/60;
    if (gs.frameCount % 30 === 0) {
      setCoins(c => c + 1);
    }
    
    gs.frameCount++;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, wingLevel, fuelLevel]);

  const startGame = () => {
    gameStateRef.current = {
      plane: { x: 100, y: 300, velocity: 0, rotation: 0 },
      obstacles: [],
      frameCount: 0,
      keys: { up: false, down: false },
      lastObstacleFrame: 0,
      airTime: 0
    };
    setScore(0);
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
    }
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  const openShop = () => {
    setGameState('shop');
  };

  const buyUpgrade = (type) => {
    if (type === 'wing' && coins >= upgradeCosts.wing) {
      setCoins(c => c - upgradeCosts.wing);
      setWingLevel(l => l + 1);
    } else if (type === 'fuel' && coins >= upgradeCosts.fuel) {
      setCoins(c => c - upgradeCosts.fuel);
      setFuelLevel(l => l + 1);
    }
  };

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Plane style={styles.titleIcon} />
            Sky Flyer
          </h1>
          <div style={styles.stats}>
            <div style={styles.coinBadge}>💰 Coins: {coins}</div>
            <div style={styles.highScoreBadge}>🏆 High: {highScore}</div>
          </div>
        </div>

        {gameState === 'menu' && (
          <div style={styles.menuContainer}>
            <Plane style={styles.menuIcon} />
            <h2 style={styles.menuTitle}>Sky Flyer</h2>
            <p style={styles.menuDescription}>
              Navigate your plane through obstacles! Use ↑ and ↓ arrow keys to fly up and down. 
              Earn coins to upgrade your plane in the shop.
            </p>
            <div style={styles.buttonContainer}>
              <button onClick={startGame} style={styles.startButton}>
                Start Game
              </button>
              <button onClick={openShop} style={styles.shopButton}>
                <Settings style={styles.buttonIcon} />
                Shop
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <div style={styles.gameHeader}>
              <div style={styles.scoreText}>Score: {score}</div>
              <div style={styles.levelText}>
                Wing Lvl {wingLevel} | Fuel Lvl {fuelLevel}
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={GAME_CONFIG.canvas.width}
              height={GAME_CONFIG.canvas.height}
              style={styles.canvas}
            />
            <div style={styles.controlsText}>
              Use ↑ ↓ arrow keys to control the plane
            </div>
          </div>
        )}

        {gameState === 'shop' && (
          <div style={styles.shopContainer}>
            <h2 style={styles.shopTitle}>Upgrade Shop</h2>
            <div style={styles.upgradeGrid}>
              <div style={styles.upgradeCardBlue}>
                <div style={styles.upgradeHeader}>
                  <TrendingUp style={styles.upgradeIcon} />
                  <div>
                    <h3 style={styles.upgradeTitle}>Better Wings</h3>
                    <p style={styles.upgradeLevel}>Level {wingLevel}</p>
                  </div>
                </div>
                <p style={styles.upgradeDescription}>
                  Improve lift and handling. Fly higher with less effort!
                </p>
                <button
                  onClick={() => buyUpgrade('wing')}
                  disabled={coins < upgradeCosts.wing}
                  style={coins >= upgradeCosts.wing ? styles.upgradeButtonActive : styles.upgradeButtonDisabled}
                >
                  Upgrade: {upgradeCosts.wing} 💰
                </button>
              </div>

              <div style={styles.upgradeCardOrange}>
                <div style={styles.upgradeHeader}>
                  <Fuel style={styles.upgradeIcon} />
                  <div>
                    <h3 style={styles.upgradeTitle}>Better Fuel</h3>
                    <p style={styles.upgradeLevel}>Level {fuelLevel}</p>
                  </div>
                </div>
                <p style={styles.upgradeDescription}>
                  Increase speed and maneuverability. Navigate obstacles faster!
                </p>
                <button
                  onClick={() => buyUpgrade('fuel')}
                  disabled={coins < upgradeCosts.fuel}
                  style={coins >= upgradeCosts.fuel ? styles.upgradeButtonActiveFuel : styles.upgradeButtonDisabled}
                >
                  Upgrade: {upgradeCosts.fuel} 💰
                </button>
              </div>
            </div>
            
            <button onClick={() => setGameState('menu')} style={styles.backButton}>
              Back to Menu
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div style={styles.gameOverContainer}>
            <h2 style={styles.gameOverTitle}>Game Over!</h2>
            <div style={styles.crashEmoji}>💥</div>
            <p style={styles.finalScore}>Score: {score}</p>
            <p style={styles.coinsEarned}>Coins Earned: {coins}</p>
            <div style={styles.buttonContainer}>
              <button onClick={startGame} style={styles.startButton}>
                Play Again
              </button>
              <button onClick={openShop} style={styles.shopButton}>
                <Settings style={styles.buttonIcon} />
                Shop
              </button>
              <button onClick={() => setGameState('menu')} style={styles.menuButton}>
                Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #60a5fa, #2563eb)',
    padding: '1rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '1.5rem',
    maxWidth: '56rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: 0
  },
  titleIcon: {
    width: '2rem',
    height: '2rem'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem'
  },
  coinBadge: {
    backgroundColor: '#fef3c7',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem'
  },
  highScoreBadge: {
    backgroundColor: '#dbeafe',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem'
  },
  menuContainer: {
    textAlign: 'center',
    padding: '3rem 0'
  },
  menuIcon: {
    width: '6rem',
    height: '6rem',
    margin: '0 auto 1.5rem',
    color: '#3b82f6'
  },
  menuTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  menuDescription: {
    color: '#4b5563',
    marginBottom: '2rem',
    maxWidth: '28rem',
    margin: '0 auto 2rem'
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  startButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    border: 'none',
    cursor: 'pointer'
  },
  shopButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  buttonIcon: {
    width: '1.25rem',
    height: '1.25rem'
  },
  gameHeader: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scoreText: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  levelText: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  canvas: {
    border: '4px solid #3b82f6',
    borderRadius: '0.5rem'
  },
  controlsText: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  shopContainer: {
    padding: '2rem 0'
  },
  shopTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  upgradeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  upgradeCardBlue: {
    border: '2px solid #93c5fd',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    backgroundColor: '#eff6ff'
  },
  upgradeCardOrange: {
    border: '2px solid #fdba74',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    backgroundColor: '#fff7ed'
  },
  upgradeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  upgradeIcon: {
    width: '2rem',
    height: '2rem'
  },
  upgradeTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0
  },
  upgradeLevel: {
    fontSize: '0.875rem',
    color: '#4b5563',
    margin: 0
  },
  upgradeDescription: {
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  upgradeButtonActive: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  upgradeButtonActiveFuel: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  upgradeButtonDisabled: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    border: 'none',
    cursor: 'not-allowed'
  },
  backButton: {
    width: '100%',
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
  },
  gameOverContainer: {
    textAlign: 'center',
    padding: '3rem 0'
  },
  gameOverTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#dc2626'
  },
  crashEmoji: {
    fontSize: '4rem',
    marginBottom: '1.5rem'
  },
  finalScore: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  coinsEarned: {
    fontSize: '1.125rem',
    color: '#4b5563',
    marginBottom: '2rem'
  },
  menuButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
  }
};

export default SkyFlyerGame;