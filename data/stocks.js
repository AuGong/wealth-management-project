const mongoCollections = require('../config/mongoCollections');
const stocks = mongoCollections.stocks;
let { ObjectId } = require('mongodb');

//Jiawei wrote the parts demonstrating the API
const https = require('https');
//const { createHmac } = require('crypto'); Not sure what this is but I didn't write this, I think, remove late if not useful
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
    if (sym.trim().length < 3 || sym.trim().length > 5){
        throw 'Error: symbol must be between 3-5 characters';
    }
    return sym.toUpperCase().trim();
}

function checkId(id, type){
    if (!id){
        return 'Error: must provide' + type + ' id';
    }
    if (typeof id != 'string'){
        return 'Error: ' + type + ' id must be a string';
    }
    if (id.trim().length === 0){
        return 'Error: ' + type + ' id must not be empty spaces';
    }
    if(!ObjectId.isValid(id)){
        return 'Error: ' + type + ' id must be a valid ObjectId';
    }
    return "";
}

function checkAmount(num){
    if (!num){
        throw 'Error: must provide amount';
    }
    if (isNaN(parseInt(num))){
        throw 'Error: amount must be a number';
    }
    if (parseInt(num) <= 0){
        throw 'Error: amount must be greater than zero';
    }
    return parseInt(num);

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
    async buyStock (userId, amount, stockId){ //updates stockholders with amount bought
        let newAmount;
        let stockCheck = checkId(stockId, 'stock');
        let userCheck = checkId(userId, 'user');
        if (stockCheck.length !== 0){
            throw stockCheck;
        }
        if (userCheck.length !== 0){
            throw userCheck;
        }
        try{
            newAmount = checkAmount(amount);
        }
        catch(e){
            throw e;
        }
        let stockCollection;
        try{
            stockCollection = await stocks();
        }
        catch(e){
            throw e;
        }
        let foundStock;
        try{
            foundStock = await stockCollection.findOne({_id: ObjectId(stockId)})
        } catch(e){
            throw e;
        }
        if (foundStock == null){
            throw 'Error: stock with given ID not found';
        }
        let temp = {
            userId: userId,
            numberOfStocks: newAmount
        }
        let newArray = foundStock.stockholders;
        let found = false;
        for (let i = 0; i < newArray.length; i++){
            if (newArray[i].userId === userId){
                newArray[i].amount += newAmount;
                found = true;
                break;
            }
        }
        if(!found){
            newArray.push(temp);
        }
        let updateCheck;
        try{
            updateCheck = await stockCollection.updateOne({_id: ObjectId(stockId)}, {$set: {stockholders: newArray}});
        }
        catch(e){
            throw e;
        }
        if (!updateCheck.acknowledged || updateCheck.matchedCount == 0 || updateCheck.modifiedCount == 0){
            throw 'Error: failed to update Stock';
        }
        return temp;
    },
    async sellStock(userId, amount, stockId){ //Sells stock, sells all if amount given is more than amount owned
        let newAmount;
        let stockCheck = checkId(stockId, 'stock');
        let userCheck = checkId(userId, 'user');
        if (stockCheck.length !== 0){
            throw stockCheck;
        }
        if (userCheck.length !== 0){
            throw userCheck;
        }
        try{
            newAmount = checkAmount(amount);
        }
        catch(e){
            throw e;
        }
        let stockCollection;
        try{
            stockCollection = await stocks();
        }
        catch(e){
            throw e;
        }
        let foundStock;
        try{
            foundStock = await stockCollection.findOne({_id: ObjectId(stockId)})
        } catch(e){
            throw e;
        }
        if (foundStock == null){
            throw 'Error: stock with given ID not found';
        }
        let newArray = foundStock.stockholders;
        let found = false;
        let i;
        for (i = 0; i < newArray.length; i++){
            if (newArray[i].userId === userId){
                found = true;
                break;
            }
        }
        if (!found){
            throw 'Error: stockholder does not own this stock';
        }
        let tempArray;
        if (newArray[i].amount <= newAmount){
            for (let j = 0; j < newArray.length; j++){
                if (j != i){
                    tempArray.push(newArray[j]);
                }
            }
        }
        else{
            tempArray = newArray[i].amount - newAmount;
        }
        let updateCheck;
        try{
            updateCheck = await stockCollection.updateOne({_id: ObjectId(stockId)}, {$set: {stockholders: tempArray}});
        }
        catch(e){
            throw e;
        }
        if (!updateCheck.acknowledged || updateCheck.matchedCount == 0 || updateCheck.modifiedCount == 0){
            throw 'Error: failed to update Stock';
        }
        return temp;
        
    },
    async createStock(symbol){ //creates a stock and adds it to the db, returns the new stock
        let newSym;
        try {
            newSym = checkSymbol(symbol);
        }
        catch(e){
            throw e;
        }
        let stockCollection;
        try{
            stockCollection = await stocks();
        }
        catch(e){
            throw e;
        }
        let foundInfo;
        try{
            foundInfo = await stockCollection.findOne({symbol: newSym});
        } catch(e){
            throw e;
        }
        if (foundInfo !== null){
            throw 'Error: stock already exists';
        }
        let insertInfo;
        let temp = {
            symbol: newSym,
            stockholders: []
        }
        try{
            insertInfo = await stockCollection.insertOne(temp);
        }
        catch(e){
            throw e;
        }
        if (insertInfo.insertedCount == 0){
            throw 'Error: failed to insert';
        }
        let newStock;
        try{
            newStock = await stockCollection.findOne({symbol: newSym});
        } catch(e){
            throw e;
        }
        return newStock;
    }
}
module.exports = exportedMethods;