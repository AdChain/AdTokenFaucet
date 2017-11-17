import React from 'react';
import Address from './Address';
import commafy from 'commafy';

const Balances = ({ adtBalance, ethBalance, loading, address  }) => {
  return (
      <div>
        <Address address={address} loading={loading} />       
        <div className="balances">
          <div className="balance-block">
            <div>{'Your Rinkeby ADT balance:'}</div>
            <div>{commafy(adtBalance)}</div>
          </div>
          <div className="balance-block">
            <div>{'Your Rinkeby ETH balance:'}</div>
            <div>{commafy(ethBalance)}</div>
          </div>
        </div>
      </div>
  );
};

export default Balances;
