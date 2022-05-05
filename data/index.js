const usersData = require("./users");
const stockData = require('./stocks');
const crpytoData = require('./crpyto');
const transactionData = require("./transaction");
const statisticsData = require("./statistics");

module.exports = {
  users: usersData,
  stocks: stockData,
  crpytos: crpytoData,
  transactions: transactionData,
  statistics: statisticsData,
};