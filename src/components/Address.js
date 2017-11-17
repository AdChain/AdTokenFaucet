import React from 'react'

const style = {
  marginBottom: '2em',
  display: 'inline-block',
  padding: '40px 30px 40px 30px',
  backgroundColor: 'rgb(16, 20, 74)',
  borderRadius: '5px',
  color: '#4585c7',
  fontSize: '1em'
}

const Address = ({ address, loading }) => {
  return (
    <div className='address-contain'>
      <div style={style} className={(loading ? 'hidden' : '') + ' address'}>
        Your <strong>Rinkeby MetaMask</strong> Address:<br />
        {address}
      </div>
    </div>
  )
}

export default Address
