const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const stockData = data.stocks;

const priceOptions = { //Replace underscore in path with desired symbol
    hostname: 'financialmodelingprep.com',
    port: 443,
    path: '/api/v3/quote-short/_?apikey=4116b7eb972d010e408e5e350e723b1a',
    method: 'GET'
  }

const nameOptions = { //Replace underscore in path with desired symbol
    hostname: 'financialmodelingprep.com',
    port: 443,
    path: '/api/v3/profile/_?apikey=4116b7eb972d010e408e5e350e723b1a',
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
/* router.post('/search', async(req, res) =>{
    if(req.session.user){
    let formData = req.body;
    let sym = formData.stockCode;
    let errors = [];
    let symCheck = checkSymbol(sym);
    if (symCheck.length !== 0){
        errors.push(symCheck);
        return res.status(400).render("stocks", {
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
        return res.status(400).render("status", {
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
        return res.status(400).render("status", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    })
    if (priceResult.length == 0 || nameResult.length == 0){
        errors.push("Error: No stock with given symbol found");
        return res.status(400).render("status", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }

    let foundStock;
    try{
        foundStock = await stockData.getStockBySymbol(sym);
    }
    catch(e){
        errors.push(e);
        return res.status(400).render("stocks", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    if (foundStock == null){
        try{
            foundStock = await stockData.createStock(sym);
        }
        catch(e){
            errors.push(e);
            return res.status(400).render("stocks", {
                title: "Error",
                authenticated: true,
                errors: errors,
            });
        }
    }
    let result = {
        stockCode: sym,
        stockName: nameResult[0].companyName,
        stockPrice: priceResult[0].price,
        numberOfShares: 0,
        marketValue: 0
    }
    if (foundStock.shareholders.length === 0){
        return result;
    }
    else{
        for(let i = 0; i < foundStock.shareholders.length; i++){
            if (req.session.user._id == foundStock.shareholders[i].userId.toString()){
                result.numberOfShares = foundStock.shareholders[i].numberOfStocks
            }
        }
        result.marketValue = result.stockPrice * result.numberOfShares;
        return result;
    }
    
}
});
router.get('/getstockinfo/:inputStockCode', async(req, res) =>{
    if (req.session.user){
    let sym = req.params.inputStockCode;
    let errors = [];
    let checkSym = checkSymbol(sym); //This contains a string with information about the error
    if (checkSym.length !== 0){
        errors.push(checkSym);
        return errors;
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
        return errors;
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
        return errors;
    })
    if (priceResult.length == 0 || nameResult.length == 0){
        errors.push("Error: No stock with given symbol found");
        return errors;
    }
    let result = {
        name: nameResult[0].companyName,
        price: priceResult[0].price
    }
    return result;
}
}); */
router.get('/', async (req, res) =>{
    if (req.session.user){
        let errors = [];
        let allStocks;
        try{
            allStocks = await stockData.getAllStocks();
        }
        catch(e){
            errors.push(e);
            return res.status(400).render("stocks", {
                title: "Error",
                authenticated: true,
                errors: errors,
              });
        }
        return res.status(200).render("stocks",{stocks: allStocks, currUser: req.session.user});
    }
})

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
    //console.log("here");
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
    //console.log("2");
    if(amountCheck.length != 0){
        errors.push(amountCheck);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        }); 
    }
    amount = parseInt(amount);
    let priceCheck = checkPrice(price);
    //console.log("3");
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
        //console.log(e);
        return res.status(400).render("trade", {
          title: "Error",
          authenticated: true,
          errors: errors,
        });
    }
    console.log(findStockCheck);
    let stockId = findStockCheck._id.toString();
    let userId = req.session.id;
   /* console.log(userId);
    console.log(amount);
    console.log(stockId);
    console.log(time);
    console.log(price);
    console.log(symbol);*/
    let stockTransactionCheck;
    if (type === "Buy"){
        try{
            stockTransactionCheck = await stockData.buyStock(userId, amount, stockId, time, price, symbol);
        }
        catch(e){
            errors.push(e);
            //console.log(errors);
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
    return res.status(200).render("trade", {currUser: req.session.user });
    //return res.status(200).render("trade");
}
});


module.exports = router;