const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use("/stocks", (req, res) => {
    res.render("stocks", {});
  });
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
