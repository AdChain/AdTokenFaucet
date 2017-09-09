import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contract from 'truffle-contract'
import Heading from './components/Heading';

import sale from './config/sale.json'
import token from './config/token.json'

const adTokenAddress = '0x896152feccb4aebf59b38d3d9c2191a94e02d977'
const saleAddress = '0xf3dc29ef78c83154c29358eb17e40bfac1b3ed22'

let web3;

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(window.web3.currentProvider);
}

const Sale = contract({
  abi: sale.abi
})
const Token = contract({
  abi: token.abi
})

Sale.setProvider(web3.currentProvider)
Token.setProvider(web3.currentProvider)

class App extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      amount: 300000,
      ethBalance: '-',
      adtBalance: '-',
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

  fetchAdtBalance = () => {
    Token.at(adTokenAddress).then(ins => {
      return ins.balanceOf.call(this.state.account)
    }).then(bal => {
      this.setState({
        adtBalance: bal.toNumber()
      })
    })
  }

  fetchEthBalance = () => {
    web3.eth.getBalance(this.state.account, (err, res) => {
      this.setState({
        ethBalance: res.toNumber() / Math.pow(10, 18)
      })
    })
  }

  handleChange = (e) => {
    this.setState({
      amount: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Sale.at(saleAddress).then(ins => {
      console.log('instance:', ins);
      
    })
  }

  render() {
    return (
      <div className="App">
        <Heading address={this.state.account} />

        <br/>

        <div onClick={this.fetchAdtBalance}>Click to see ADT Balance:</div>
        <div>{this.state.adtBalance}</div>

        <br/>

        <div onClick={this.fetchEthBalance}>Click to see ETH Balance:</div>
        <div>{this.state.ethBalance}</div>

        <br/>
        
        <form onSubmit={this.handleSubmit}>
          <div>Enter ADT Amount you'd like to purchase (default 300,000):</div>

          <input value={this.state.amount} onChange={this.handleChange} />

          <button>Buy ADT</button>
        </form>

      </div>
    );
  }
}

export default App;
