let { ObjectId } = require('mongodb');
const transactionsJs = require('./transaction.js');


// let newTransaction ={
//   userId: userId,
//   assetId: stockId,
//   date: time,
//   transactionType: false,
//   assetType: true,
//   quantity: amount,
//   price: price
// }

// module.exports = {


  // async getStockName() {
  //   let transactions = await transactionsJs.queryAll();
  //       let names = new Array();
  //       for (let i = 0; i<transactions.length; i++){
  //         if (!names.includes(transactions[i].symbol)) {
  //           names.push(transactions[i].symbol);
  //         }
  //       }
  //       return names;
  // },
  module.exports = {
  async queryAllForStatistics(userId){
    let transactions = await transactionsJs.getUserTransactions(userId);
    let symbols = new Array();
    for (let i = 0; i<transactions.length; i++){
      if (!symbols.includes(transactions[i].symbol)) {
        symbols.push(transactions[i].symbol);
      }
    }
    for (let i = 0; i < symbols.length; i ++){
      var array = []
      var shift = 0
      var data = await transactionsJs.getUserTransactionsBySymbol(userId, symbols[i]);
      for (let i = 0; i < data.length; i++){
        if (data[i].transactionType == "Sell"){
          shift -= data[i].price * data[i].quantity;
        }
        shift += data[i].price * data[i].quantity;
      }
      var avenueByStock = {
        symbol: symbols[i],
        avenue : shift
      }
      array.push(avenueByStock);
    }
    return array;
}
}

//   async  queryAll(){
//     const stocksCollection = await stocks();
//     let data = await stocksCollection.find({});
//     let newStatistics ={
//   symbol: data.symbol,
//   quantity: data.amount
// }
//     return newStatistics;
// },

// async  queryByCode(userId){
//   const transactionsCollection = await transactions();
//   let data = await transactionsCollection.find({: foundSymbol});
//   let newStatistics ={
// symbol: data.symbol,
// quantity: data.price
// }
//   return newStatistics;
// }


// };