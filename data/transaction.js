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
  async  queryAll(){
    const transactionCollection = await transactions();
    let data = await transactionCollection.find({}).toArray();
    return data;
  },


  async queryByCode(foundSymbol){
    const transactionsCollection = await transactions();
    let data = await transactionsCollection.find({symbol: foundSymbol}).sort({date: -1}).toArray();
    return data;
    }
}