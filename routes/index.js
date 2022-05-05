const userRoutes = require('./users');
const stockRoutes = require('./stocks');
const cryptoRoutes = require('./crypto');
const transactionRoutes = require('./transactions');
const statisticsRoutes = require("./statistics");

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use("/stocks", stockRoutes);
  // app.use('/crypto',cryptoRoutes);
  app.use("/crypto", (req, res) => {
    res.render("crypto", {});
  });
  app.use("/transactions", transactionRoutes);
  app.use("/statistics", statisticsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ Error: "Not found" });
  });
};

module.exports = constructorMethod;
