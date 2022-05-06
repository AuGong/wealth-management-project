const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const stockData = data.stocks;
const axios = require ('axios');
/*
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
  } */
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

function removeElementAtIndex(arr, index){
    if (index >= arr.length){
        return arr;
    }
    else{
        let result= [];
        for (let i = 0; i < arr.length; i++){
            if (index != i){
                result.push(arr[i]);
            }
        }
        return result;
    }
}
/* 
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
            console.log(e);
            return res.status(400).render("stocks", {
                title: "Error",
                authenticated: true,
                errors: errors,
              });
        }
        let ownedStocks;
        try{
            ownedStocks = await stockData.getAllStocksOwned(req.session.user._id);
        }
        catch(e){
            errors.push(e);
            console.log(e);
            return res.status(400).render("stocks", {
                title: "Error",
                authenticated: true,
                errors: errors,
              });
        }
        console.log(ownedStocks);
        let result = [];
        for (let i = 0; i < allStocks.length; i++){
            let temp = {
                symbol: allStocks[i].symbol,
                name: "",
                price: 0,
                numberOfShares: 0,
                marketValue: 0
            };
            for (let j = 0; j < ownedStocks.length; j++){
                if (ownedStocks[j].stockId == allStocks[i]._id.toString()){
                    temp.numberOfShares = ownedStocks[j].amount;
                    ownedStocks = removeElementAtIndex(ownedStocks, j);
                    break;
                }
            }
            let info = await axios.get(`https://financialmodelingprep.com/api/v3/quote/${allStocks[i].symbol}?apikey=4116b7eb972d010e408e5e350e723b1a`);
            temp.price = info.data[0].price;
            temp.name = info.data[0].name;
            temp.marketValue = temp.numberOfShares * temp.price;
            result.push(temp);
        }
        return res.status(200).render("stocks",{stocks: result, currUser: req.session.user});
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
    if (findStockCheck == null){
        try{
            findStockCheck = await stockData.createStock(symbol);
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
    let stockId = findStockCheck._id.toString();
    let userId = req.session.user._id;
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