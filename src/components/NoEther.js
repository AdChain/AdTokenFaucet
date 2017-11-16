import React from 'react';

const noEtherStyle = {
  marginBottom: '2em',
  color:"white"
}

const NoEther = () => {
  return (
    <div style={noEtherStyle}>
      {"Uh oh! Looks like your Rinkeby ETH account is empty. If you'd like some free Rinkeby test ETH, visit the "}
      <a
        href="https://faucet.rinkeby.io"
        rel="noopener noreferrer"
        target="_blank"
      >
        {'Rinkeby ETH Faucet'}
      </a>
    </div>
  );
};

export default NoEther;
