import React from 'react'

const styles = {
  button: {
    border: '1px solid rgb(69, 133, 199)',
    marginLeft: '1em',
    color: 'white',
    background: 'rgb(69, 133, 199)',
    fontSize: '1em',
    padding: '10px',
    fontFamily: "'Titillium Web', sans-serif"
  },
  text: {
    color: '#4585c7',
    fontSize: '1.4em',
    margin: '25px 0'
  },
  bottomText: {
    color: '#4585c7',
    fontSize: '.9em',
    margin: '25px 0'
  },
  input: {
    height: '30px',
    width: '242px',
    border: '3px solid rgb(17, 144, 255)',
    background: 'rgb(16, 20, 74)',
    color: 'white',
    fontSize: '14px',
    paddingLeft: '5px'
  },
  color: {
    color: '#4585c7'
  }
}

const PurchaseAdt = ({ handleSubmit, handleChange, amount }) => {
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div style={styles.text}>{"Enter the amount of Rinkeby ETH you'd like to send:"}</div>
          <input style={styles.input} value={amount} onChange={handleChange} />
          <button style={styles.button}>{'Buy Rinkeby ADT'}</button>
        </form>
      </div>
      <div style={styles.bottomText}>
        You can acquire more Rinkeby ETH <a style={styles.color} href='https://faucet.rinkeby.io'>here</a>
      </div>
    </div>
  )
}

export default PurchaseAdt
