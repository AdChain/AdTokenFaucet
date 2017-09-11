import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contract from 'truffle-contract';
import unit from 'ethjs-unit';
import BN from 'bn.js';
import 'whatwg-fetch';

import Heading from './components/Heading';

let saleUrl = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/Sale.json';
let tokenUrl = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/HumanStandardToken.json';

let web3;

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(window.web3.currentProvider);
}

let getSale = async () => {
  const saleArtifact = await fetch(saleUrl);
  const Sale = contract(await saleArtifact.json());

  Sale.setProvider(web3.currentProvider);

  return Sale.deployed();
}

let getToken = async () => {
  const sale = await getSale();
  const tokenAddress = await sale.token.call();
  const tokenArtifact = await fetch(tokenUrl);
  const Token = contract(await tokenArtifact.json());

  Token.setProvider(web3.currentProvider);

  return Token.at(tokenAddress);
}


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
    this.setupBalances()
  }
  
  setupBalances = async () => {
    const account = web3.eth.accounts[0];
    const token = await getToken();
    const rawBal = await token.balanceOf.call(account);

    const adtDisplayValue = rawBal.div(new BN('10', 10).pow(new BN('9', 10)));

    web3.eth.getBalance(account, (err, res) => {
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
    const saleInstance = await getSale();

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
            <div>Click to see ADT Balance:</div>
            <div>{this.state.adtBalance}</div>
          </div>
          <div style={styles.eth}>
            <div>ETH Balance:</div>
            <div>{this.state.ethBalance}</div>
          </div>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div>Enter ETH Amount you'd like to send (default 1):</div>

          <input value={this.state.amount} onChange={this.handleChange} />

          <button>Buy ADT</button>
        </form>

        <br />

        {this.state.txHash && tx}

      </div>
    );
  }
}

export default App;
