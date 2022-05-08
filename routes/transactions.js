const express = require("express");
const router = express.Router();
const data = require("../data");
const transactionData = data.transactions;
const validation = require("../public/js/validation");

router.get('/', async(req,res) =>{
    if (req.session.user) {
        let userId = req.session.user._id;
        errors = [];
        try {
            userTransactions = await transactionData.getUserTransactions(userId);
            for (let i = 0; i < userTransactions.length; i++) {
                userTransactions[i].date = transactionData.getTime(
                  userTransactions[i].date
                );
            }
            res.render("transactions", {
              currUser: req.session.user,
              userTransactions: userTransactions,
            });
        } catch(e) {
            errors.push(e);
            res
              .status(400)
              .render("transactions", { currUser: req.session.user, errors: errors });
        }    
    }
});

router.post('/', async(req,res) =>{
    if (req.session.user) {
        let userId = req.session.user._id;
        let symbol = req.body.inputStockCode;
        errors = [];

        try {
          symbol = validation.checkNormalString(symbol, "Code");
          symbol = symbol.toUpperCase();
        } catch (e) {
          errors.push(e);
          res
            .status(400)
            .render("transactions", {
              currUser: req.session.user,
              errors: errors,
            });
        }    
        
        try {
            userTransactions =
              await transactionData.getUserTransactionsBySymbol(userId, symbol);
            for (let i = 0; i < userTransactions.length; i++) {
                userTransactions[i].date = transactionData.getTime(
                  userTransactions[i].date
                );
            }
            res.render("transactions", {
              currUser: req.session.user,
              userTransactions: userTransactions,
            });
        } catch(e) {
            errors.push(e);
            res
              .status(400)
              .render("transactions", { currUser: req.session.user, errors: errors });
        }    
    }
});

module.exports = router;