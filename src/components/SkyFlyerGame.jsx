import React, { useState, useRef } from 'react';
import { Plane } from 'lucide-react';
import { getUpgradeCost } from '../utils/gameUtils';
import { useGameLoop } from '../hooks/useGameLoop';
import MenuScreen from './MenuScreen';
import GameScreen from './GameScreen';
import ShopScreen from './ShopScreen';
import GameOverScreen from './GameOverScreen';

const SkyFlyerGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, shop, gameover
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Upgrades
  const [wingLevel, setWingLevel] = useState(1);
  const [fuelLevel, setFuelLevel] = useState(1);

  // Game loop hook
  const { resetGame } = useGameLoop(
    canvasRef,
    gameState,
    wingLevel,
    fuelLevel,
    setScore,
    setCoins,
    () => endGame()
  );

  const startGame = () => {
    resetGame();
    setScore(0);
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const openShop = () => {
    setGameState('shop');
  };

  const buyUpgrade = (type) => {
    const cost = getUpgradeCost(type, type === 'wing' ? wingLevel : fuelLevel);
    
    if (coins >= cost) {
      setCoins(c => c - cost);
      if (type === 'wing') {
        setWingLevel(l => l + 1);
      } else if (type === 'fuel') {
        setFuelLevel(l => l + 1);
      }
    }
  };

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
          <MenuScreen 
            onStartGame={startGame}
            onOpenShop={openShop}
          />
        )}

        {gameState === 'playing' && (
          <GameScreen 
            canvasRef={canvasRef}
            score={score}
            wingLevel={wingLevel}
            fuelLevel={fuelLevel}
          />
        )}

        {gameState === 'shop' && (
          <ShopScreen 
            coins={coins}
            wingLevel={wingLevel}
            fuelLevel={fuelLevel}
            onBuyUpgrade={buyUpgrade}
            onBackToMenu={() => setGameState('menu')}
          />
        )}

        {gameState === 'gameover' && (
          <GameOverScreen 
            score={score}
            coins={coins}
            onPlayAgain={startGame}
            onOpenShop={openShop}
            onBackToMenu={() => setGameState('menu')}
          />
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
  }
};

export default SkyFlyerGame;