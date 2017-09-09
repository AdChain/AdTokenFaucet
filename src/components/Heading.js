import React from 'react';
import adChainLogo from '../assets/ad_chain.png';

const Heading = ({ address }) => {
  return (
    <div>
      <img src={adChainLogo} />
      <div>Your MetaMask address is:</div>
      <div>{address}</div>
    </div>
  );
};

export default Heading;
