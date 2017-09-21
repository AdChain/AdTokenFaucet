import React from 'react';
import AdTokenPrice from './AdTokenPrice';

const PurchaseAdt = ({ handleSubmit, handleChange, amount }) => {
  return (
    <div>
      <AdTokenPrice />
      <form onSubmit={handleSubmit}>
        <div>{"Enter the amount of Rinkeby ETH you'd like to send:"}</div>

        <input value={amount} onChange={handleChange} />

        <button>{'Buy Rinkeby ADT with Rinkeby ETH'}</button>
      </form>
    </div>
  );
};

export default PurchaseAdt;
