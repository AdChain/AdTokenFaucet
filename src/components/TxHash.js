import React from 'react';

const txHashStyle = {
  padding: '1em',
  color:"white"
}

const TxHash = ({ txHash }) => (
  <div style={txHashStyle}>
    <div>Your transaction:</div>
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={`https://rinkeby.etherscan.io/tx/${txHash}`}
    >
      {txHash}
    </a>
  </div>
);

export default TxHash;
