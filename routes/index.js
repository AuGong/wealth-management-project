const userRoutes = require('./users');
const stockRoutes = require('./stocks');
const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('*', (req, res) => {
        res.status(404).json({ Error: 'Not found' })
    });
  app.use('/stocks', stockRoutes);
  
  app.use("/login", (req, res) => {
    res.render("login", {});
  });
  app.use("/signup", (req, res) => {
    res.render("signUp", {});
  });
  app.use("/user", (req, res) => {
    res.render("user", {});
  });
  app.use("/trade", (req, res) => {
    res.render("trade", {});
  });
  app.use("/crypto", (req, res) => {
    res.render("crypto", {});
  });
  app.use("/transactions", (req, res) => {
    res.render("transactions", {});
  });
};

module.exports = constructorMethod;
