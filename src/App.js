import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contract from 'truffle-contract';
import unit from 'ethjs-unit';
import BN from 'bn.js';
import 'whatwg-fetch';

import Heading from './components/Heading';

class App extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      amount: 1,
      ethBalance: '-',
      adtBalance: '-',
      txHash: ''
    }
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
      this.setupBalances();
    }, 1000);
  }

  getSale = async () => {
    let saleUrl = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/Sale.json';
    const saleArtifact = await fetch(saleUrl);
    const Sale = contract(await saleArtifact.json());

    Sale.setProvider(this.web3.currentProvider);

    return Sale.deployed();
  }

  getToken = async () => {
    const sale = await this.getSale();
    let tokenUrl = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/HumanStandardToken.json';
    const tokenAddress = await sale.token.call();
    const tokenArtifact = await fetch(tokenUrl);
    const Token = contract(await tokenArtifact.json());

    Token.setProvider(this.web3.currentProvider);

    return Token.at(tokenAddress);
  }
  
  setupBalances = async () => {
    const token = await this.getToken();
    const account = this.web3.eth.accounts[0];
    const rawBal = await token.balanceOf.call(account);
    
    const adtDisplayValue = rawBal.div(new BN('10', 10).pow(new BN('9', 10)));

    this.web3.eth.getBalance(account, (err, res) => {
      const ethDisplayValue = res.div(new BN('10', 10).pow(new BN('18', 10)))
      this.setState({
        account: account,
        adtBalance: adtDisplayValue.toString(10),
        ethBalance: ethDisplayValue.toString(10)
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      amount: e.target.value
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const saleInstance = await this.getSale();

    const weiValue = unit.toWei(this.state.amount, 'ether');

    const txHash = await saleInstance.purchaseTokens({
      from: this.state.account,
      value: weiValue
    });

    this.setState({
      txHash: txHash.tx
    });
  }

  render() {
    const tx = (
      <div>
        <div>Your transaction:</div>
        <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${this.state.txHash}`}>{this.state.txHash}</a>
      </div>
    );

    const styles = {
      balances: {
        padding: '1em',
        display: 'flex',
        justifyContent: 'center'
      },
      adt: {
        border: '1px solid blue',
        margin: '1em'
      },
      eth: {
        border: '1px solid grey',
        margin: '1em'
      }
    }

    return (
      <div className="App">
        <Heading address={this.state.account} />

        <br />

        <div style={styles.balances}>
          <div style={styles.adt} onClick={this.fetchAdtBalance}>
            <div>Your Rinkeby ADT balance:</div>
            <div>{this.state.adtBalance}</div>
          </div>
          <div style={styles.eth}>
            <div>Your Rinkeby ETH balance:</div>
            <div>{this.state.ethBalance}</div>
          </div>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div>Enter the amount of Rinkeby ETH you'd like to send:</div>

          <input value={this.state.amount} onChange={this.handleChange} />

          <button>Buy Rinkeby ADT with Rinkeby ETH</button>
        </form>

        <br />

        {this.state.txHash && tx}

      </div>
    );
  }
}

export default App;
