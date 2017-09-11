import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contract from 'truffle-contract';
import unit from 'ethjs-unit';
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
  const saleArtifact = await fetch(saleUrl)
  const Sale = contract(await saleArtifact.json())
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
      ethBalance: '',
      adtBalance: '',
      txHash: ''
    }
  }

  componentDidMount() {
    this.setState({
      account: this.fetchAccounts()
    })
  }

  fetchAccounts = () => {
    const accounts = web3.eth.accounts;
    return accounts[0];
  }

  fetchAdtBalance = async () => {
    const token = await getToken();
    const balance = await token.balanceOf.call(this.state.account);

    this.setState({
      adtBalance: balance.toString(10)
    });
  }

  fetchEthBalance = () => {
    web3.eth.getBalance(this.state.account, (err, res) => {
      this.setState({
        ethBalance: res.toNumber() / Math.pow(10, 18)
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

    const weiValue = unit.toWei(this.state.amount, 'ether')

    const txHash = await saleInstance.purchaseTokens({
      from: this.state.account,
      value: weiValue
    });

    this.setState({
      txHash: txHash.tx
    });
  }

  callback = (err, result) => {
    if (err) {
      console.log('error:', err);
    } else {
      console.log('result:', result);
      this.setState({
        txHash: result
      });
    }
  }

  render() {
    const tx = (
      <div>
        <div>Your transaction:</div>
        <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${this.state.txHash}`}>{this.state.txHash}</a>
      </div>
    );

    return (
      <div className="App">
        <Heading address={this.state.account} />

        <br />

        <div onClick={this.fetchAdtBalance}>Click to see ADT Balance:</div>
        <div>{this.state.adtBalance}</div>

        <br />

        <div onClick={this.fetchEthBalance}>Click to see ETH Balance:</div>
        <div>{this.state.ethBalance}</div>

        <br />

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
