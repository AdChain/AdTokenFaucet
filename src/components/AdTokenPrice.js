import React from 'react'

const style = {
  priceBox: {
    marginBottom: '2em',
    color: 'white'
  },
  text: {
    fontSize: '1.4em',
    color: 'rgb(69, 133, 199)'
  }
}

const AdTokenPrice = ({loading}) => {
  return (
    <div style={style.priceBox} className={loading ? 'hidden' : ''}>
      <div style={style.text}>
        {'1 Rinkeby ETH is about 17,500 Rinkeby ADT'}
      </div>
    </div>
  )
}

export default AdTokenPrice
