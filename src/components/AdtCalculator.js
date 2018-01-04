import React, { Component } from 'react'
import commafy from 'commafy'

function formatValue (value) {
  return commafy(+(value).toFixed())
}

class AdtCalculator extends Component {
  constructor (props) {
    super()

    const ethUsd = 0
    const adtUsd = 0
    const adtEth = adtUsd / ethUsd
    const ethAdt = 1 / adtEth

    this.state = {
      ethUsd,
      ethAdt,
      adtEth,
      adtUsd
    }

    this.getPrices = this.getPrices.bind(this)

    this.getPrices()
  }

  componentWillUnmount () {
    this.clearTimeout()
  }

  render () {
    const {
      ethAdt
    } = this.state

    return (
      <div>
        1 Rinkeby ETH is about {ethAdt ? formatValue(ethAdt) : '-'} Rinkeby ADT
      </div>
    )
  }

  async getPrices () {
    const {ethUsd, adtUsd} = await this.priceStats()
    const adtEth = adtUsd / ethUsd
    const ethAdt = 1 / adtEth

    this.setState({
      ethUsd,
      adtUsd,
      adtEth,
      ethAdt
    })

    this.clearTimeout()
    this.pricesTimeout = setTimeout(() => this.getPrices(), 25e3)
  }

  clearTimeout () {
    if (this.pricesTimeout) {
      window.clearTimeout(this.pricesTimeout)
    }
  }

  url (ticker) {
    return `https://api.coinmarketcap.com/v1/ticker/${ticker}/?convert=USD`
  }

  async priceStats () {
    const result = await Promise.all([
      window.fetch(this.url('ethereum')),
      window.fetch(this.url('adtoken'))
    ])

    const result1 = await result[0].json()
    const result2 = await result[1].json()

    const ethUsd = parseFloat(result1[0].price_usd, 10)
    const adtUsd = parseFloat(result2[0].price_usd, 10)

    return Promise.resolve({ethUsd, adtUsd})
  }
}

export default AdtCalculator
