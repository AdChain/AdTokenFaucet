import React from 'react';
import AdTokenPrice from './AdTokenPrice';

const styles = {
  button: {
    border: '1px solid #4585c7',
    marginLeft: '1em'
  }
}

const PurchaseAdt = ({ handleSubmit, handleChange, amount }) => {
  return (
    <div>
      <AdTokenPrice />
      <form onSubmit={handleSubmit}>
        <div>{"Enter the amount of Rinkeby ETH you'd like to send:"}</div>

        <input value={amount} onChange={handleChange} />

        <button style={styles.button}>{'Buy Rinkeby ADT with Rinkeby ETH'}</button>
      </form>
    </div>
  );
};

export default PurchaseAdt;
