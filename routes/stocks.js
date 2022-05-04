const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const stockData = data.stocks;
const xss = require('xss');

const priceOptions = { //Replace underscore in path with desired symbol
    hostname: 'financialmodelingprep.com',
    port: 443,
    path: '/api/v3/quote-short/_?apikey=4116b7eb972d010e408e5e350e723b1a',
    method: 'GET'
  }

const nameOptions = { //Replace underscore in path with desired symbol
    hostname: 'financialmodelingprep.com',
    port: 443,
    path: '/api/v3/profile/AAPL?apikey=4116b7eb972d010e408e5e350e723b1a',
    method: 'GET'
  }
function checkSymbol (sym){
    if (!sym){
        return 'Error: must enter symbol';
    }
    if (typeof sym != 'string'){
        return 'Error: symbol must be a string';
    }
    if (sym.trim().length === 0){
        return 'Error: symbol cannot be empty strings';
    }
    if (sym.trim().length < 3 || sym.trim().length > 5){
        return 'Error: symbol must be between 3-5 characters';
    }
    return "";
}

function checkAmount(num){
    if (!num){
        return 'Error: must provide amount';
    }
    if (isNaN(parseInt(num))){
        return 'Error: amount must be a number';
    }
    if (parseInt(num) <= 0){
        return 'Error: amount must be greater than zero';
    }
    return "";
}
function checkPrice(price){
    if (!price){
        return 'Error: must provide price'
    }
    if(typeof price != 'number'){
        return 'Error: price must be a number';
    }
    if (price <= 0){
        return 'Error: price must be greater than zero';
    }
    return "";
}
router.get('/:symbol', async(req, res) =>{
    let sym = req.params.symbol;
    let symCheck = checkSymbol(sym);
    if (symCheck.length !== 0){
        //display an error
    }
    sym = sym.trim().toUpperCase();
    let foundStock;
    try{
        foundStock = await stockData.getStockBySymbol(sym);
        //Render the page for single stocks
    }
    catch(e){
        //display an error
    }
});
router.post('/getstockinfo', async(req, res) =>{
    if (req.session.user){
    let formData = req.body;
    let sym = formData.inputStockCode;
    let errors = [];
    let checkSym = checkSymbol(sym); //This contains a string with information about the error
    if (checkSym.length !== 0){
        errors.push(checkSym);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    sym = sym.trim().toUpperCase();
    let tempPriceOptions = priceOptions;
    let newPath = tempPriceOptions.path.split("_");
    newPath = newPath[0] + sym + newPath[1];
    tempPriceOptions.path = newPath;
    let priceResult;
    const priceReq = https.request(tempPriceOptions, (res) => {
        res.on('data', (d) => {
          priceResult = d;
        })
      })
    priceReq.on('error', (error) => {
        errors.push(error);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    })
    let tempNameOptions = nameOptions;
    newPath = tempNameOptions.split("_");
    newPath = newPath[0] + sym + newPath[1];
    tempNameOptions.path = newPath;
    let nameResult;
    const nameReq = https.request(tempNameOptions, (res) => {
        res.on('data', (d) => {
          nameResult = d;
        })
      })
    nameReq.on('error', (error) => {
        errors.push(error);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    })
    if (priceResult.length == 0 || nameResult.length == 0){
        errors.push("Error: No stock with given symbol found");
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    let result = {
        name: nameResult[0].companyName,
        price: priceResult[0].price
    }
    return res.status(200).render("trade", {title: "foundStockInfo", authenticated: true, foundStockInfo: result});
}
});

router.post('/tradestock', async (req, res) =>{
    if (req.session.user){
    let formData = req.body;
    let amount = formData.inputQuantity;
    let price = formData.inputStockPrice;
    let symbol = formData.inputStockCode;
    let time = Date.now();
    let type = formData.inputTradeType;
    let errors = [];
    let symCheck = checkSymbol(symbol);
    if (symCheck.length != 0){
        errors.push(symCheck);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    symbol = symbol.trim().toUpperCase();
    let amountCheck = checkAmount(amount);
    if(amountCheck.length == 0){
        errors.push(amountCheck);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        }); 
    }
    amount = parseInt(amount);
    let priceCheck = checkPrice(price);
    if (priceCheck.length == 0){
        errors.push(priceCheck);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    let findStockCheck;
    try{
        findStockCheck = await stockData.getStockBySymbol(symbol);
    }
    catch(e){
        errors.push(e);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    let stockId = findStockCheck._id.toString();
    let userId = req.session.user._id; 
    let stockTransactionCheck;
    if (type === "Buy"){
        try{
            stockTransactionCheck = await stockData.buyStock(userId, amount, stockId, time, price);
        }
        catch(e){
            errors.push(e);
            return res.status(400).render("trade", {
                title: "Error",
                authenticated: true,
                errors: errors,
            });
        }
    }
    else{
        try{
            stockTransactionCheck = await stockData.sellStock(userId, amount, stockId, time, price);
        }
        catch(e){
            errors.push(e);
            return res.status(400).render("trade", {
                title: "Error",
                authenticated: true,
                errors: errors,
            });
        }
    }
    return res.status(200).render("trade");
}
});


module.exports = router;