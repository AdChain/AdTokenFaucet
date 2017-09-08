import React, { Component } from 'react';
import './App.css';

import Heading from './components/Heading';

class App extends Component {
  constructor() {
    super();
    this.state = {
      address: '',
      accounts: [],
      adTokenBalances: [],
    }
  }
  
  componentDidMount() {
    this.setState({
      accounts: this.fetchAccounts()
    });
  }

  fetchAccounts = () => {
    const { web3 } = window;
    const accounts = web3.eth.accounts;

    console.log(accounts);
    return accounts;
  }

  handleChange = (e) => {
    this.setState({
      address: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('address:', this.state.address);
  }

  render() {
    return (
      <div className="App">
        <Heading />
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.address} onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}

export default App;
