import React from 'react';

const styles = {
  balances: {
    padding: '1em',
    display: 'flex',
    justifyContent: 'center'
  },
  adt: {
    border: '2px solid #4585c7',
    margin: '1em',
    marginTop: 0,
    padding: '.3em'
  },
  eth: {
    border: '2px solid #3C3C3D',
    margin: '1em',
    marginTop: 0,
    padding: '.3em'
  }
};

const Balances = ({ adtBalance, ethBalance }) => {
  return (
    <div>
      <div style={styles.balances}>
        <div style={styles.adt}>
          <div>{'Your Rinkeby ADT balance:'}</div>
          <div>{adtBalance}</div>
        </div>
        <div style={styles.eth}>
          <div>{'Your Rinkeby ETH balance:'}</div>
          <div>{ethBalance}</div>
        </div>
      </div>
    </div>
  );
};

export default Balances;
