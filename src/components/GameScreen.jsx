import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const GameScreen = ({ canvasRef, score, wingLevel, fuelLevel }) => {
  return (
    <div>
      <div style={styles.header}>
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
  );
};

const styles = {
  header: {
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
  }
};

export default GameScreen;