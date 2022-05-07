const mongoCollections = require('../config/mongoCollections');
const stocks = mongoCollections.stocks;
const transactions = mongoCollections.transactions;
let { ObjectId } = require('mongodb');

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
    async buyStock (userId, amount, stockId, time, price, symbol){ //updates stockholders with amount bought, and adds a transaction, returns the updated stock
        let newAmount;
        let newSym;
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
        try{
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
        let foundStock;
        try{
            foundStock = await stockCollection.findOne({_id: ObjectId(stockId)})
        } catch(e){
            throw e;
        }
        if (foundStock == null){ //If stock does not exist, add it to db
            try{
                foundStock = await this.createStock(newSym);
            }
            catch (e){
                throw e;
            }
        }
        let temp = {
            userId: ObjectId(userId),
            numberOfStocks: newAmount
        }
        let newArray = foundStock.stockholders;
        let found = false;
        if (newArray.length != 0){
        for (let i = 0; i < newArray.length; i++){
            if (newArray[i].userId.toString() == userId){
                newArray[i].numberOfStocks += newAmount;
                found = true;
                break;
            }
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

        //Start adding purchase to transactions
        let newTransaction ={
            userId: userId,
            symbol: newSym,
            date: time,
            transactionType: "Buy",
            assetType: "Stock",
            quantity: amount,
            price: price
        }
        let transactionCollection;
        try{
            transactionCollection = await transactions();
        }
        catch(e){
            throw e;
        }
        let buyInsertInfo
        try{
            buyInsertInfo = transactionCollection.insertOne(newTransaction);
        }
        catch(e){
            throw e;
        }
        if (buyInsertInfo.insertedCount == 0){
            throw 'Error: failed to add purchase to transactions';
        }
        return temp;
    },
    async sellStock(userId, amount, stockId, time, price){ //Sells stock, sells all if amount given is more than amount owned, adds transaction to collection
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
            if (newArray[i].userId.toString() == userId){
                found = true;
                break;
            }
        }
        if (!found){
            throw 'Error: stockholder does not own this stock';
        }
        let tempArray = [];
        if (newArray[i].numberOfStocks <= newAmount){
            for (let j = 0; j < newArray.length; j++){
                if (j != i){
                    tempArray.push(newArray[j]);
                }
            }
        }
        else{
            newArray[i].numberOfStocks -= newAmount;
            tempArray = newArray;
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
        //Start adding purchase to transactions
        let newTransaction ={
            userId: userId,
            symbol: foundStock.symbol,
            date: time,
            transactionType: "Sell",
            assetType: "Stock",
            quantity: amount,
            price: price
        }
        let transactionCollection;
        try{
            transactionCollection = await transactions();
        }
        catch(e){
            throw e;
        }
        let buyInsertInfo
        try{
            buyInsertInfo = await transactionCollection.insertOne(newTransaction);
        }
        catch(e){
            throw e;
        }
        if (buyInsertInfo.insertedCount == 0){
            throw 'Error: failed to add purchase to transactions';
        }
        return tempArray;
        
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
    },
    async getAllStocks(){
        const stockCollection = await stocks().catch((err) => { throw err; });
        const allStocks = await stockCollection.find().toArray();
        
        for (let i = 0; i < allStocks.length; i++){
            allStocks[i]._id = allStocks[i]._id.toString();
        }
        return allStocks;
    },
    async getAllStocksOwned(userId){ // returns [{stockId, amount}] for all stocks a user has
        let userCheck = checkId(userId, 'user');
        if (userCheck.length !== 0){
            throw userCheck;
        }
        let stockCollection;
        try{
            stockCollection = await stocks();
        }
        catch(e){
            throw e;
        }
        let findMatchingStocks;
        try{
            findMatchingStocks = await stockCollection.find({'stockholders.userId': ObjectId(userId)}).toArray();
        }
        catch(e){
            throw e;
        }
        if (findMatchingStocks.length != 0){ //I know I could just iterate through the cursor but I don't want to have to deal with any potential issues with cursors
             //This might just be toArray, but idk what mongo returns if nothing is found
            let result = [];
            for (let i = 0; i < findMatchingStocks.length; i++){
                let temp = {
                    stockId: findMatchingStocks[i]._id.toString(),
                    amount: 0
                }
                for (let j = 0; j < findMatchingStocks[i].stockholders.length; j++){
                    if (userId == findMatchingStocks[i].stockholders[j].userId.toString()){
                        temp.amount = findMatchingStocks[i].stockholders[j].numberOfStocks;
                        break;
                    }
                }
                result.push(temp);
            }
            return result;
        }
        else{
            return [];
        }
        
    }
}
module.exports = exportedMethods;