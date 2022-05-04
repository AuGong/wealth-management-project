const mongoCollections = require('../config/mongoCollections');
const crptocurrency = mongoCollections.cryptocurrency;
const transactions = mongoCollections.transactions
const { ObjectId } = require('mongodb');
const { cryptocurrency } = require('../config/mongoCollections');
const users = require('./users');
const cryptoNames = {'BTC':'Bitcoin','ETH':'Ethereum','BNB':'BNB',
'SOL':'Solana','XRP':'XRP','LUNA':'Terra',
'ADA':'Cardano','DOGE':'Dogecoin','AVAX':'Avalanche','DOT':'Polkadot'}

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
    if(!ObjectId.keys(crpytoNames).includes(sym.toUpperCase().trim())) throw `only support these crpytos: ${ObjectId.keys(crpytoNames)}`
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

function checkTransType(t){
    if(!t) throw "transaction type must be provided"
    if ( t !="0" || t !="1") throw "transaction type can only be 0 or 1"
    return parseInt(num);
}

function checkPrice(price){
    if(!price) throw "price must be provided"
    if(isNaN(Number(price))) throw "price must be a number"
    return Number(price)
}



module.exports = {
    async insertUser(userId,symbol,number,transType,price){ 
        // 1. symbol: crpytoCurrency symbol
        // 2. number: the amount of crpytocoins to buy or sell               
        // 3. transType: Buy:0, Sell:1 
        // 4. price: unit price of crpytocurrency
        try{
            let niceUserId = checkId(userId) // check if userId is objectId
        }catch(e){
            throw e
        }
        try{
            let niceAmount = checkAmount(number)
        }catch(e){
            throw e
        }
        try{
            let niceSymbol = checkSymbol(symbol) 
        }catch(e){
            throw e
        }
        try{
            let niceTransType = checkTransType(transType)
        }catch(e){
            throw e
        }
        try{
            let nicePrice = checkPrice(price)
        }catch(e){
            throw e
        }


        const crpytoCollection = await cryptocurrency()
        let crypto = crpytoCollection.findOne({symbol:niceSymbol})
        if (crypto === null) {   
            if(transType!=="0") throw `there is no ${niceSymbol} to sell` //when there is no the corresponding 
                                                                          // symbol, you can not sell
            else{
                //in this block we create new symbol to DB and then add it to transction record
                let newCrpyto = {
                    crpytoId: ObjectId().toString(),
                    symbol: niceSymbol,
                    coinHolders:[{"userId":niceUserId,"numberOfCoins":niceAmount}]
                }
                const inserInfo = await crpytoCollection.insertOne(newCrpyto)
                if (!insertInfo.acknowledged || !insertInfo.insertedId)
                    throw 'Could not add the crpytoCurrency';
                else{
                    const transCollection = await transactions()
                    let newRecord = {
                        "userId": niceUserId ,
	                    "assetId": "6248ac7824970de22351cdaa",
	                    "date": Date.now(),
	                    "transactionType": niceTransType,
	                    "assetType": false,
	                    "quantity": niceAmount,
	                    "price": nicePrice
                    }
                   const transInsertInfo = await transCollection.insertOne(newRecord)
                   if (!transInsertInfo.acknowledged || !transInsertInfo.insertedId)
                    throw 'Could not add the transection record';

                }
            }
        }
        else{ // when the crpytocurrency exists
            
            // when transection type is sell:
            if(niceTransType==1){
                const crpytoWithUser = await cryptocurrency.findOne({symbol:niceSymbol,coinHolders: {$elemMatch:{userId : niceUserId} }})
                if (crpytoWithUser===null){
                    throw "the user dosen't hold this crpytocurrency"
                }
                else{
                    let coinHolders = crpytoWithUser.coinHolders
                    let userShares // object of userId and numberOfCoins
                    coinHolders.forEach(element => {
                        if (element["userId"]===niceUserId) userShares = element
                    });
                    if(userShares["numberOfCoins"] < niceAmount) throw `cannot sell more than ${originalAmount}` //holding number < selling number
                    else{ // update holding number
                        userShares["numberOfCoins"] -= niceAmount
                        for (let i = 0; j < coinHolders.length; j++){
                            if (coinHolders[i]["userId"]=== niceUserId){
                                coinHolders[i]=userShares
                            }
                        }
                        let updateInfo = await cryptocurrency.updateOne({symbol:niceSymbol},{$set:{coinHolders:coinHolders}})
                        const transCollection = await transactions() // insert a selling transection record
                        let newRecord = {
                            "userId": niceUserId ,
                            "assetId": "6248ac7824970de22351cdaa",
                            "date": Date.now(),
                            "transactionType": niceTransType,
                            "assetType": false,
                            "quantity": niceAmount,
                            "price": nicePrice
                        }
                        const transInsertInfo = await transCollection.insertOne(newRecord) // insert a new transection record
                        if (!transInsertInfo.acknowledged || !transInsertInfo.insertedId)
                            throw 'Could not add the transection record';
                    }
                    
                }
            }
            // when transection type is buy
            else if (niceTransType == 0){
                //continue to write buy
                let coinHolders = crypto.coinHolders
                let userShares = {}
                for (let i=0;i<coinHolders.length;i++){
                    if(coinHolders[i]["userId"]==niceUserId){
                        userShares = coinHolders[i]
                        userShares["numberOfCoins"] += niceAmount
                        coinHolders[i] = userShares
                        
                    }
                   if(Object.keys(userShares).length === 0){
                        coinHolders.push({"userId":niceUserId,"numberOfCoins":niceAmount})
                   }
                }

                let updateInfo = await cryptocurrency.updateOne({symbol:niceSymbol},{$set:{coinHolders:coinHolders}})
                const transCollection = await transactions() // insert a selling transection record
                    let newRecord = {
                        "userId": niceUserId ,
                        "assetId": "6248ac7824970de22351cdaa",
                        "date": Date.now(),
                        "transactionType": niceTransType,
                        "assetType": false,
                        "quantity": niceAmount,
                        "price": nicePrice
                    }
                const transInsertInfo = await transCollection.insertOne(newRecord) // insert a new transection record
                if (!transInsertInfo.acknowledged || !transInsertInfo.insertedId)   throw 'Could not add the transection record';
                    
            }
        }
    },
    async searchCrpyto(symbol){
        //blur search from database
        try{
            let niceSymbol = checkSymbol(symbol)
        }catch(e){
            throw e
        }
        const crpytoCollection = await crptocurrency()
        let crpyto = crpytoCollection.find({symbol:{$regex:'.*' + niceSymbol + '.*'}})
        if(crpyto===null){
            throw "not find any relative crpyto"
        }
        
        return {"crpytoName":cryptoNames[niceSymbol],"coinHolders":crpyto.coinHolders}
    }
}