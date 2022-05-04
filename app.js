const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require("express-session");

const handlebarsInstance = exphbs.create({ defaultLayout: "main" });

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  console.log("Timestamp " + new Date().toUTCString());
  console.log("Request Method: " + req.method);
  console.log("Request Routes: " + req.originalUrl);
  next();
  if (req.session) {
    if (!req.session.username) {
      console.log("(Non-Authenticated User)");
    } else {
      console.log("Authenticated User");
    }
  } else {
    console.log("(Non-Authenticated User)");
  }
  console.log("=============================================");
});

app.use("/trade", (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).render("notLogin", { title: "Not Login" });
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
