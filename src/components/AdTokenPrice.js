import React from 'react';

const style = {
  marginBottom: '2em'
}

const AdTokenPrice = () => {
  return (
    <div style={style}>
      <div>
        {'1 ADT costs 57140 GWEI'}
      </div>
      <div>
        {'1 ETH will get you ~17,500 ADT'}
      </div>
    </div>
  );
};

export default AdTokenPrice;
