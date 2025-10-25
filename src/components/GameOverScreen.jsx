import React from 'react';
import { ShoppingBasket } from 'lucide-react';

const GameOverScreen = ({ 
  score, 
  coins, 
  onPlayAgain, 
  onOpenShop, 
  onBackToMenu 
}) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Game Over!</h2>
      <div style={styles.crashEmoji}>💥</div>
      <p style={styles.finalScore}>Score: {score}</p>
      <p style={styles.coinsEarned}>Coins Earned: {coins}</p>
      <div style={styles.buttonContainer}>
        <button onClick={onPlayAgain} style={styles.startButton}>
          Play Again
        </button>
        <button onClick={onOpenShop} style={styles.shopButton}>
          <ShoppingBasket style={styles.buttonIcon} />
          Shop
        </button>
        <button onClick={onBackToMenu} style={styles.menuButton}>
          Menu
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '3rem 0'
  },
  title: {
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
    border: 'none',
    cursor: 'pointer'
  },
  shopButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
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

export default GameOverScreen;