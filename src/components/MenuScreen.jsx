import React from 'react';
import { Plane, ShoppingBasket } from 'lucide-react';

const MenuScreen = ({ onStartGame, onOpenShop }) => {
  return (
    <div style={styles.container}>
      <Plane style={styles.icon} />
      <h2 style={styles.title}>Sky Flyer</h2>
      <p style={styles.description}>
        Navigate your plane through obstacles! Use ↑ and ↓ arrow keys to fly up and down. 
        Earn coins to upgrade your plane in the shop.
      </p>
      <div style={styles.buttonContainer}>
        <button onClick={onStartGame} style={styles.startButton}>
          Start Game
        </button>
        <button onClick={onOpenShop} style={styles.shopButton}>
          <ShoppingBasket style={styles.buttonIcon} />
          Shop
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
  icon: {
    width: '6rem',
    height: '6rem',
    margin: '0 auto 1.5rem',
    color: '#3b82f6'
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  description: {
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
  }
};

export default MenuScreen;