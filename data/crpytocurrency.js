const mongoCollections = require('../config/mongoCollections');
const crptocurrency = mongoCollections.cryptocurrency;
const { ObjectId } = require('mongodb');
const { cryptocurrency } = require('../config/mongoCollections');

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
module.exports = {
    async create(symbol){
        try{
           let niceSymbol = checkSymbol(symbol)
        }catch(e){
            throw e
        }
        const crptoCollection = await cryptocurrency();

    }
}