import React from 'react'
import adtoken from '../assets/adtoken_logo_white.png'

const styles = {
  imgStyle: {
    maxWidth: '13em'
  },
  container: {
    color: '#4585c7',
    fontSize: '1.3em',
    textAlign: 'center',
    marginTop: '3em'
  },
  infoBlock: {
    padding: '15px 2.4em',
    backgroundColor: '#10144a',
    maxWidth: '1100px',
    borderRadius: '5px'
  },
  color: {
    color: '#4585c7'
  }
}

const Heading = () => {
  return (
    <div style={styles.container}>
      <div><img src={adtoken} alt='adToken' style={styles.imgStyle} /></div>
      <div style={styles.infoBlock}>
        <div>{'Welcome to the Rinkeby AdToken Faucet!'}</div>
        <div>
          {'To purchase Rinkeby ADT, you can send Rinkeby ETH from your '}
          <a style={styles.color} href='https://metamask.io' target='_blank' rel='noopener noreferrer'>
            MetaMask
          </a>
          {' account'}
        </div>
      </div>
    </div>
  )
}

export default Heading
