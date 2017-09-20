import React from 'react';
import cat from '../assets/cat.png';

const imgStyle = {
  maxWidth: '400px'
};

const needMoreMeta = (
  <div>Please unlock MetaMask and connect to the Rinkeby Test Network</div>
);

const Heading = ({ address, needMeta, rinkeby }) => {
  return (
    <div>
      <img src={cat} alt="adChain logo" style={imgStyle} />
      <div>Welcome to the Rinkeby AdToken Faucet!</div>
      <div>
        To purchase Rinkeby ADT, you can send Rinkeby ETH from your{' '}
        <a href="https://metamask.io" target="_blank">
          MetaMask
        </a>{' '}
        account
      </div>
      <br />
      {address && rinkeby ? (
        <div>
          <div>Your Rinkeby MetaMask address:</div>
          <div>{address}</div>
        </div>
      ) : (
        needMoreMeta
      )}
    </div>
  );
};

export default Heading;
