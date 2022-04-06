const constructorMethod = (app) => {
  app.use("/login", (req, res) => {
    res.render("login", {});
  });
  app.use("/signup", (req, res) => {
    res.render("signUp", {});
  });
};

module.exports = constructorMethod;
