import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contract from 'truffle-contract';
import unit from 'ethjs-unit';
import BN from 'bn.js';
import 'whatwg-fetch';

import Heading from './components/Heading';
import Dialog from './components/Dialog';
import NoEther from './components/NoEther';
import Balances from './components/Balances';
import PurchaseAdt from './components/PurchaseAdt';
import TxHash from './components/TxHash';
import AdTokenPrice from './components/AdTokenPrice';

class App extends Component {
  constructor() {
    super();
    this.state = {
      amount: 1,
      ethBalance: '-',
      adtBalance: '-',
      txHash: '',
      loading: true,
      message: 'Please unlock MetaMask and connect to the Rinkeby Test Network',
      subMessage: '',
      address : '',
      metaMask: false
    };
  }

  componentDidMount() {
    window.setTimeout(() => {
      if (typeof this.web3 !== 'undefined') {
        this.web3 = new Web3(this.web3.currentProvider);
      } else if (typeof window.web3 !== 'undefined') {
        this.web3 = new Web3(window.web3.currentProvider);
      } else {
        throw new Error('You need MetaMask!');
      }

      this.web3.eth.defaultAccount = this.web3.eth.accounts[0];
      if (this.web3.eth.defaultAccount) {
        this.setupBalances();
      } else if (this.web3.eth.defaultAccount === undefined) {
        this.setState({
          message: 'Please unlock MetaMask and connect to the Rinkeby Test Network',
          loading: false
        });
      }
    }, 1000);
  }

  getSale = async () => {
    let saleUrl = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/Sale.json';
    let saleArtifact;

    try {
      saleArtifact = await fetch(saleUrl);
    } catch (err) {
      return false;
    }

    const Sale = contract(await saleArtifact.json());

    Sale.setProvider(this.web3.currentProvider);

    try {
      await Sale.deployed();
    } catch (err) {
      this.setState({
        message: 'Please unlock MetaMask and connect to the Rinkeby Test Network',
        loading: false
      });
    }

    return Sale.deployed();
  };

  getToken = async () => {
    const sale = await this.getSale();

    if (!sale) {
      return false;
    }

    let tokenUrl =
      'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/HumanStandardToken.json';
    const tokenAddress = await sale.token.call();
    const tokenArtifact = await fetch(tokenUrl);
    const Token = contract(await tokenArtifact.json());

    Token.setProvider(this.web3.currentProvider);

    return Token.at(tokenAddress);
  };

  trimDecimals = (n) => (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');

  setupBalances = async () => {
    const token = await this.getToken();

    if (!token) {
      this.setState({
        message: 'Hmm...something went wrong. If you are running an ad blocker, please disable it to continue',
        loading: false
      });
      return false;
    }

    const account = this.web3.eth.accounts[0];
    const rawBal = await token.balanceOf.call(account);

    const adtDisplayValue = rawBal.div(new BN('10', 10).pow(new BN('9', 10)));

    const adtBalance = this.trimDecimals(adtDisplayValue);

    this.web3.eth.getBalance(account, (err, res) => {
      const ethDisplayValue = res.div(new BN('10', 10).pow(new BN('18', 10)));
      const ethBalance = this.trimDecimals(ethDisplayValue);

      this.setState({
        message: 'Your Rinkeby MetaMask address:',
        subMessage: account,
        address: account,
        adtBalance: adtBalance.toString(10),
        ethBalance: ethBalance.toString(10),
        loading: false,
        metaMask: true
      });
    });
  };

  handleChange = e => {
    this.setState({
      amount: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const saleInstance = await this.getSale();

    console.log('saleInstance', saleInstance);

    const weiValue = unit.toWei(this.state.amount, 'ether');

    const txn = {
      from: this.state.subMessage,
      value: weiValue
    }

    const txHash = await saleInstance.purchaseTokens.sendTransaction(txn);
    
    this.setState({
      txHash: txHash
    })
  };

  render() {
    return (
      <div className="App">
          <Heading />
          <Dialog message={this.state.message} metaMask={this.state.metaMask} loading={this.state.loading} subMessage={this.state.subMessage} />
          <div className="mt-25">
              {
                this.state.subMessage && (<Balances loading={this.state.loading} address={this.state.address}  adtBalance={this.state.adtBalance} ethBalance={this.state.ethBalance} /> )
              }
              {
                this.state.ethBalance === '0' && <NoEther />
              }
              {
                <AdTokenPrice loading={this.state.loading}/>
              }
              {
                this.state.subMessage && ( <PurchaseAdt handleChange={this.handleChange} handleSubmit={this.handleSubmit} amount={this.state.amount} /> )
              }
              {
                this.state.txHash && <TxHash txHash={this.state.txHash} />
              }
          </div>
      </div>
    );
  }
}

export default App;
