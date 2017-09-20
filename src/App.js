import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contract from 'truffle-contract';
import unit from 'ethjs-unit';
import BN from 'bn.js';
import 'whatwg-fetch';

import Heading from './components/Heading';
import AdTokenPrice from './components/AdTokenPrice';

class App extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      amount: 1,
      ethBalance: '-',
      adtBalance: '-',
      txHash: '',
      rinkeby: true,
      needMeta: false,
      landingPageMessage: ''
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
          needMeta: true
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
        rinkeby: false
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

  setupBalances = async () => {
    const token = await this.getToken();
    const adBlocker = (
      <div>
        {'Hmm...something went wrong. If you are running an ad blocker, please disable it to continue'}
      </div>
    );
    if (!token) {
      this.setState({
        landingPageMessage: adBlocker
      });
      return false;
    }
    const account = this.web3.eth.accounts[0];
    const rawBal = await token.balanceOf.call(account);

    const adtDisplayValue = rawBal.div(new BN('10', 10).pow(new BN('9', 10)));

    this.web3.eth.getBalance(account, (err, res) => {
      const ethDisplayValue = res.div(new BN('10', 10).pow(new BN('18', 10)));
      this.setState({
        rinkeby: true,
        account: account,
        adtBalance: adtDisplayValue.toString(10),
        ethBalance: ethDisplayValue.toString(10)
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
      from: this.state.account,
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
    };

    const noEth = (
      <div>
        {"Uh oh! Looks like your Rinkeby ETH account is empty. If you'd like some free Rinkeby test ETH, visit the "}
        <a href="https://faucet.rinkeby.io" rel='noopener noreferrer' target="_blank">
          {"Rinkeby ETH Faucet"}
        </a>
      </div>
    );

    return (
      <div className="App">
        <Heading
          address={this.state.account}
          needMeta={this.state.needMeta}
          rinkeby={this.state.rinkeby}
          landingPageMessage={this.state.landingPageMessage}
        />

        <br />

        {this.state.ethBalance === '0' && noEth}

        <div>
          <div style={styles.balances}>
            <div style={styles.adt} onClick={this.fetchAdtBalance}>
              <div>{'Your Rinkeby ADT balance:'}</div>
              <div>{this.state.adtBalance}</div>
            </div>
            <div style={styles.eth}>
              <div>{'Your Rinkeby ETH balance:'}</div>
              <div>{this.state.ethBalance}</div>
            </div>
          </div>
        </div>

        <AdTokenPrice />

        {this.state.account && (
          <form onSubmit={this.handleSubmit}>
            <div>{"Enter the amount of Rinkeby ETH you'd like to send:"}</div>

            <input value={this.state.amount} onChange={this.handleChange} />

            <button>{'Buy Rinkeby ADT with Rinkeby ETH'}</button>
          </form>
        )}

        <br />

        {this.state.txHash && tx}
      </div>
    );
  }
}

export default App;
