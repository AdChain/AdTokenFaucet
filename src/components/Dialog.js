import React from 'react'

const styles = {
  dialogStyle: {
    color: '#F79220',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '5px'
  },
  infoBlock: {
    backgroundColor: '#1190ff',
    fontSize: '1em',
    padding: '1em 7em',
    borderRadius: '5px',
    color: 'white',
    marginTop: '50px'
  },
  text: {
    color: 'rgb(69, 133, 199)',
    fontSize: '0.9em',
    margin: '25px 0px'
  }
}

const Dialog = ({ message, loading, metaMask }) => {
  return (
    <div style={styles.dialogStyle} className={loading ? 'hidden' : ''}>
      <div className={metaMask ? 'hidden' : ''}>
        <div style={styles.infoBlock} >
          {message}
        </div>
        <div style={styles.text}>
          If you would like further instructions on acquiring Rinkeby ETH and Rinkeby ADT, please watch our instructional video <a style={styles.text} href='https://adchain.zendesk.com/hc/en-us/articles/115003185653-How-to-Acquire-Rinkeby-ETH-and-Rinkeby-ADT'>here</a>.
        </div>
      </div>
    </div>
  )
}

export default Dialog
