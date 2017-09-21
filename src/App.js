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

class App extends Component {
  constructor() {
    super();
    this.state = {
      amount: 1,
      ethBalance: '-',
      adtBalance: '-',
      txHash: '',
      message: 'Please unlock MetaMask and connect to the Rinkeby Test Network',
      subMessage: ''
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
          message: 'Please unlock MetaMask and connect to the Rinkeby Test Network'
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
        message: 'Please unlock MetaMask and connect to the Rinkeby Test Network'
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
        message: 'Hmm...something went wrong. If you are running an ad blocker, please disable it to continue'
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
        adtBalance: adtBalance.toString(10),
        ethBalance: ethBalance.toString(10)
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

    const weiValue = unit.toWei(this.state.amount, 'ether');

    const txHash = await saleInstance.purchaseTokens({
      from: this.state.subMessage,
      value: weiValue
    });

    this.setState({
      txHash: txHash.tx
    });
  };

  render() {
    const tx = (
      <div>
        <div>Your transaction:</div>
        <a
          rel='noopener noreferrer'
          target="_blank"
          href={`https://rinkeby.etherscan.io/tx/${this.state.txHash}`}
        >
          {this.state.txHash}
        </a>
      </div>
    );

    return (
      <div className="App">
        <Heading />

        <Dialog
          message={this.state.message}
          subMessage={this.state.subMessage}
        />

        {this.state.subMessage && (
          <Balances 
            adtBalance={this.state.adtBalance}
            ethBalance={this.state.ethBalance}
          />
        )}
        
        {this.state.ethBalance === '0' && <NoEther />}

        {this.state.subMessage && (
          <PurchaseAdt 
            handleChange={this.handleChange} 
            handleSubmit={this.handleSubmit} 
            amount={this.state.amount} 
          />
        )}

        {this.state.txHash && tx}
      </div>
    );
  }
}

export default App;
