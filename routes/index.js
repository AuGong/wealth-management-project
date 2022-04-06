const constructorMethod = (app) => {
  app.use("/", (req, res) => {
    res.render("login", {});
  });
};

module.exports = constructorMethod;
