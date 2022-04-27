const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const stockData = data.stocks;

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
router.post('/search', async(req, res) =>{
    let formData = req.body;
    let sym = formData.symbol;
    let checkSym = checkSymbol(sym);
    if (checkSym.length !== 0){
        //display error
    }
    sym = sym.trim().toUpperCase();
    
});

module.exports = router;