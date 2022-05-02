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
    let formData = req.body;
    let sym = formData.symbol;
    let checkSym = checkSymbol(sym); //This contains a string with information about the error
    if (checkSym.length !== 0){
        //display error
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
        //display an error
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
        //display an error
    })
    if (priceResult == 0 || nameResult.length == 0){
        //API did not find a stock that matches symbol,display error
    }
    let result = {
        name: nameResult[0].companyName,
        price: priceResult[0].price
    }
    return result;
});

router.post('/tradestock', async (req, res) =>{
    let formData = req.body;
    
});


module.exports = router;