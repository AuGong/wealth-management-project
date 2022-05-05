const userRoutes = require('./users');
const stockRoutes = require('./stocks');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use("/stocks", stockRoutes);
  app.use("/crypto", (req, res) => {
    res.render("crypto", {});
  });
  app.use("/transactions", (req, res) => {
    res.render("transactions", {});
  });
  app.use("*", (req, res) => {
    res.status(404).json({ Error: "Not found" });
  });
};

module.exports = constructorMethod;
