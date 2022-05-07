const mongoCollections = require('../config/mongoCollections');
const transactions = mongoCollections.transactions;
let { ObjectId } = require('mongodb');

// let newTransaction ={
//   userId: userId,
//   assetId: stockId,
//   date: time,
//   transactionType: false,
//   assetType: true,
//   quantity: amount,
//   price: price
// }

module.exports = {
  async getUserTransactions(userId) {
    const transactionCollection = await transactions();
    let data = await transactionCollection.find({ userId: userId }).toArray();
    return data;
  },

  async getUserTransactionsBySymbol(symbol) {
    const transactionsCollection = await transactions();
    let data = await transactionsCollection
      .find({ userId: userId, symbol: foundSymbol })
      .sort({ date: -1 })
      .toArray();
    return data;
  },

  getTime(transactionDate) {
    let date = new Date(transactionDate);
    let nowMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    let seperator = "-";
    if (nowMonth >= 1 && nowMonth <= 9) {
      nowMonth = "0" + nowMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let fullDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    return fullDate;
  }
};