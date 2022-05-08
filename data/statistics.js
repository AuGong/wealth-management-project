const transactionsJs = require('./transaction.js');

module.exports = {
  async queryAllForStatistics(userId){
    let transactions = await transactionsJs.getUserTransactions(userId);
    let stockSymbols = new Array();
    let cryptoSymbols = new Array();
    for (let i = 0; i < transactions.length; i++){
      if (transactions[i].assetType == "Stock") {
        if (!stockSymbols.includes(transactions[i].symbol)) {
          stockSymbols.push(transactions[i].symbol);
        }
      }
      if (transactions[i].assetType == "Crypto") {
        if (!cryptoSymbols.includes(transactions[i].symbol)) {
          cryptoSymbols.push(transactions[i].symbol);
        }
      }
    }

    let stockArray = new Array();
    let cryptoArray = new Array();

    for (let i = 0; i < stockSymbols.length; i++) {
      let data = await transactionsJs.getUserTransactionsBySymbol(
        userId,
        stockSymbols[i]
      );
      let shift = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].transactionType == "Sell") {
          shift -= data[i].price * data[i].quantity;
        } else {
          shift += data[i].price * data[i].quantity;
        }
      }
      let avenueByStock = {
        symbol: stockSymbols[i],
        avenue: shift,
      };
      stockArray.push(avenueByStock);
    }
    
    for (let i = 0; i < cryptoSymbols.length; i++) {
      let data = await transactionsJs.getUserTransactionsBySymbol(
        userId,
        cryptoSymbols[i]
      );
      let shift = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].transactionType == "Sell") {
          shift -= data[i].price * data[i].quantity;
        } else {
          shift += data[i].price * data[i].quantity;
        }
      }
      let avenueByStock = {
        symbol: cryptoSymbols[i],
        avenue: shift,
      };
      cryptoArray.push(avenueByStock);
    }
    
    return { stockArray: stockArray, cryptoArray: cryptoArray };
  }
}