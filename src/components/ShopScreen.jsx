import React from 'react';
import { TrendingUp, Fuel } from 'lucide-react';
import { getUpgradeCost } from '../utils/gameUtils';

const ShopScreen = ({ 
  coins, 
  wingLevel, 
  fuelLevel, 
  onBuyUpgrade, 
  onBackToMenu 
}) => {
  const wingCost = getUpgradeCost('wing', wingLevel);
  const fuelCost = getUpgradeCost('fuel', fuelLevel);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upgrade Shop</h2>
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
            onClick={() => onBuyUpgrade('wing')}
            disabled={coins < wingCost}
            style={coins >= wingCost ? styles.upgradeButtonActive : styles.upgradeButtonDisabled}
          >
            Upgrade: {wingCost} 💰
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
            onClick={() => onBuyUpgrade('fuel')}
            disabled={coins < fuelCost}
            style={coins >= fuelCost ? styles.upgradeButtonActiveFuel : styles.upgradeButtonDisabled}
          >
            Upgrade: {fuelCost} 💰
          </button>
        </div>
      </div>
      
      <button onClick={onBackToMenu} style={styles.backButton}>
        Back to Menu
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem 0'
  },
  title: {
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
  }
};

export default ShopScreen;