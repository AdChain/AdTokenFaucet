import React from 'react'
import AdtCalculator from './AdtCalculator'

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
        <AdtCalculator />
      </div>
    </div>
  )
}

export default AdTokenPrice
