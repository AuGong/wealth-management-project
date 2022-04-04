//Author Jiawei Lu

//Real time bitcoin price
// Ustage
//https://docs.ccxt.com/en/latest/manual.html

const ccxt = require("ccxt");
async function findstock() {
  let binance = new ccxt.binance();
  let result = await binance.fetch_ticker('BTC/USDT');
  console.log( result);
  return result};

  findstock();



//Real time stock price
// Ustage
//https://site.financialmodelingprep.com/developer/docs#Stock-Price

const https = require('https')

const options = {
  hostname: 'financialmodelingprep.com',
  port: 443,
  path: '/api/v3/quote-short/AAPL?apikey=4116b7eb972d010e408e5e350e723b1a',
  method: 'GET'
}

const req = https.request(options, (res) => {
  res.on('data', (d) => {
    process.stdout.write(d)
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.end()

// Historical Daily Prices
// Ustage
//https://www.npmjs.com/package/yahoo-stock-prices


const yahooStockPrices = require("yahoo-stock-prices");

  async function findstock2() {
    var today = new Date();
    var tewntyDayPeriod = new Date();
   tewntyDayPeriod.setDate(today.getDate() - 20);
    const prices = await yahooStockPrices.getHistoricalPrices(
     tewntyDayPeriod.getMonth(),
     tewntyDayPeriod.getDate(),
     tewntyDayPeriod.getFullYear(),
     today.getMonth(),
     today.getDate(),
     today.getFullYear(),
     "TSLA",
     "1d"
   );
   console.log(prices);
};

findstock2()