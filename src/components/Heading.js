import React from 'react';
import cat from '../assets/cat.png';

const imgStyle = {
  maxWidth: '500px',
}

const Heading = ({ address }) => {
  return (
    <div>
      <img src={cat} alt='adChain logo' style={imgStyle} />
      <div>Your address:</div>
      <div>{address}</div>
    </div>
  );
};

export default Heading;
