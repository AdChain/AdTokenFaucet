import React from 'react';

const style = {
  priceBox: {
    marginBottom: '2em',
    color:"white",
  },
  text: {
    fontSize: "1.4em",
    color: "rgb(69, 133, 199)"
  }
}

const AdTokenPrice = () => {
  return (
    <div style={style.priceBox}>
      <div style={style.text}>
        {'1 ETH is about 17,500 ADT'}
      </div>
    </div>
  );
};

export default AdTokenPrice;
