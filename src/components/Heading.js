import React from 'react';
import adtoken from '../assets/adtoken.png';

const styles = {
  imgStyle: {
    maxWidth: '400px'
  },
  container: {
    margin: '2em',
    color: '#4585c7',
    fontSize: '1.3em'
  }
};

const Heading = () => {
  return (
    <div style={styles.container}>
      <img src={adtoken} alt="adToken" style={styles.imgStyle} />
      <div>{'Welcome to the Rinkeby AdToken Faucet!'}</div>
      <div>
        {'To purchase Rinkeby ADT, you can send Rinkeby ETH from your '}
        <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
          MetaMask
        </a>
        {' account'}
      </div>
    </div>
  );
};

export default Heading;
