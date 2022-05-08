const mongoCollections = require('../config/mongoCollections');
const transactions = mongoCollections.transactions;

module.exports = {
  async getUserTransactions(userId) {
    const transactionCollection = await transactions();
    let data = await transactionCollection
      .find({ userId: userId })
      .sort({ date: -1 })
      .toArray();
    return data;
  },

  async getUserTransactionsBySymbol(userId, symbol) {
    const transactionsCollection = await transactions();
    let data = await transactionsCollection
      .find({ userId: userId, symbol: symbol })
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
    let fullDate =
      date.getFullYear() + seperator + nowMonth + seperator + strDate;
    return fullDate;
  },
};