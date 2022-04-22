const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const stocks = mongoCollections.stocks;
let { ObjectId } = require('mongodb');

//Jiawei wrote the parts demonstrating the API
const https = require('https');
let options = {
    hostname: 'financialmodelingprep.com',
    port: 443,
    path: '/api/v3/quote-short/AAPL?apikey=4116b7eb972d010e408e5e350e723b1a',
    method: 'GET'
};
//This function checks the symbol's validness, returns the all caps version of stock symbol
function checkSymbol (sym){
    if (!sym){
        throw 'Error: must enter symbol';
    }
    if (typeof sym != 'string'){
        throw 'Error: symbol must be a string';
    }
    if (sym.trim().length === 0){
        throw 'Error: symbol cannot be empty strings';
    }
    if (sym.length < 3 || sym.length > 5){
        throw 'Error: symbol must be between 3-5 characters';
    }
    return sym.toUpperCase();
}


let exportedMethods = {
    async getStockBySymbol(symbol){
        let updatedSymbol; //to get all caps vers. of symbol
        try{
            updatedSymbol = checkSymbol(symbol);
        }
        catch(e){
            throw e;
        }
        let stockCollection;
        try{stockCollection = await stocks();}catch(e){throw e;}
        let foundStock;
        try{
            foundStock = await stockCollection.findOne({symbol: updatedSymbol});
        } catch(e){
            throw e;
        }
        return foundStock;
    },
    async updateStock(symbol){

    },
    async addStock(symbol){

    }
}
module.exports = exportedMethods;