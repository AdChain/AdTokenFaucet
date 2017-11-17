import React from 'react'

const styles = {
  txHashStyle: {
    padding: '1em',
    color: 'white',
    fontFamily: "'Titillium Web', sans-serif"
  },
  link: {
    fontFamily: "'Titillium Web', sans-serif",
    color: 'rgb(69, 133, 199)'
  }

}

const TxHash = ({ txHash }) => (
  <div style={styles.txHashStyle}>
    <div>Your transaction:</div>
    <a style={styles.link} rel='noopener noreferrer' target='_blank' href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
      {txHash}
    </a>
  </div>
)

export default TxHash
