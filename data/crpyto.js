const mongoCollections = require('../config/mongoCollections');
const cryptocurrency = mongoCollections.cryptocurrency;
const transactions = mongoCollections.transactions
const { ObjectId } = require('mongodb');
const axios = require("axios")
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
    if(!Object.keys(cryptoNames).includes(sym.toUpperCase().trim())) throw `only support these cryptos: ${Object.keys(cryptoNames)}`
    return sym.toUpperCase().trim();
}

function checkId(id){
    if (!id){
        throw 'Error: must provide' + ' id';
    }
    if (typeof id != 'string'){
        throw 'Error: ' + ' id must be a string';
    }
    if (id.trim().length === 0){
        throw 'Error: ' + ' id must not be empty spaces';
    }
    if(!ObjectId.isValid(id)){
        throw 'Error: ' + ' id must be a valid ObjectId';
    }
    return id.trim();
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
    if ( t !="Buy" && t !="Sell") throw "transaction type can only be Buy or Sell"
    return t;
}

function checkPrice(price){
    if(!price) throw "price must be provided"
    if(isNaN(Number(price))) throw "price must be a number"
    return Number(price)
}
module.exports = {
    async insertUser(userId,assetType,symbol,number,transType,price){ 
        // 1. symbol: cryptoCurrency symbol
        // 2. number: the amount of cryptocoins to buy or sell               
        // 3. transType: Buy, Sell
        // 4. price: unit price of cryptocurrency
        let niceUserId = checkId(userId) // check if userId is objectId
        let niceAmount = checkAmount(number)
        let niceSymbol = checkSymbol(symbol) 
        let niceTransType = checkTransType(transType)
        let nicePrice = checkPrice(price)
        if(assetType!=='Crypto'){
            throw "you only buy crypto property!"
        }
        const cryptoCollection = await cryptocurrency()
        let crypto = await cryptoCollection.findOne({symbol:niceSymbol})
        if (crypto === null) {   
            if(transType!=="Buy") throw `there is no ${niceSymbol} to sell` //when there is no the corresponding 
                                                                          // symbol, you can not sell
            else{
                //in this block we create new symbol to DB and then add it to transction record
                let newCrypto = {
                    cryptoId: ObjectId().toString(),
                    symbol: niceSymbol,
                    coinHolders:[{"userId":niceUserId,"numberOfCoins":niceAmount}]
                }
                const insertInfo = await cryptoCollection.insertOne(newCrypto)
                if (!insertInfo.acknowledged || !insertInfo.insertedId)
                    throw 'Could not add the cryptoCurrency';
                else{
                    const transCollection = await transactions()
                    let newRecord = {
                        "userId": niceUserId ,
	                    "symbol": niceSymbol,
	                    "date": Date.now(),
	                    "transactionType": niceTransType,
	                    "assetType": 'Crypto',
	                    "quantity": niceAmount,
	                    "price": nicePrice
                    }
                   const transInsertInfo = await transCollection.insertOne(newRecord)
                   if (!transInsertInfo.acknowledged || !transInsertInfo.insertedId)
                    throw 'Could not add the transection record';

                }
            }
        }
        else{ // when the cryptocurrency exists
            
            // when transection type is sell:
            if(niceTransType==="Sell"){
                const cryptoWithUser = await cryptoCollection.findOne({symbol:niceSymbol,coinHolders: {$elemMatch:{userId : niceUserId} }})
                if (cryptoWithUser===null){
                    throw "the user dosen't hold this cryptocurrency"
                }
                else{
                    let coinHolders = cryptoWithUser.coinHolders
                    let userShares = {}// object of userId and numberOfCoins
                    coinHolders.forEach(element => {
                        if (element["userId"]===niceUserId) userShares = element
                    });
                    if(Object.keys(userShares).length===0){
                        throw "not found this user"
                    }else{
                        if(userShares["numberOfCoins"] < niceAmount) throw `cannot sell more than ${userShares["numberOfCoins"]}` //holding number < selling number
                        else{ // update holding number
                            userShares["numberOfCoins"] -= niceAmount
                            for (let i = 0; i < coinHolders.length; i++){
                                if (coinHolders[i]["userId"]=== niceUserId){
                                    coinHolders[i]=userShares
                                }
                            }
                        }
                        let updateInfo = await cryptoCollection.updateOne({symbol:niceSymbol},{$set:{coinHolders:coinHolders}})
                        const transCollection = await transactions() // insert a selling transection record
                            let newRecord = {
                                "userId": niceUserId ,
                                "symbol": niceSymbol,
                                "date": Date.now(),
                                "transactionType": niceTransType,
                                "assetType": 'Crypto',
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
            else if (niceTransType === "Buy"){
                //continue to write buy
                let coinHolders = crypto.coinHolders
                let userShares = {}
                for (let i=0;i<coinHolders.length;i++){
                    if(coinHolders[i]["userId"]==niceUserId){
                        userShares = coinHolders[i]
                        userShares["numberOfCoins"] += niceAmount
                        coinHolders[i] = userShares
                        
                    }
                   
                }
                if(Object.keys(userShares).length === 0){
                    coinHolders.push({"userId":niceUserId,"numberOfCoins":niceAmount})
               }

                let updateInfo = await cryptoCollection.updateOne({symbol:niceSymbol},{$set:{coinHolders:coinHolders}})
                const transCollection = await transactions() // insert a buying transection record
                    let newRecord = {
                        "userId": niceUserId ,
                        "symbol": niceSymbol,
                        "date": Date.now(),
                        "transactionType": niceTransType,
                        "assetType": 'Crypto',
                        "quantity": niceAmount,
                        "price": nicePrice
                    }
                const transInsertInfo = await transCollection.insertOne(newRecord) // insert a new transection record
                if (!transInsertInfo.acknowledged || !transInsertInfo.insertedId)   throw 'Could not add the transection record';
                    
            }
        }
    },
    async searchCrypto(symbol,userId){
        //blur search from database
        let price, marketValue
        let niceUserId = checkId(userId)
        let numberOfShares = 0
        let niceSymbol = checkSymbol(symbol)    
        let url = "https://financialmodelingprep.com/api/v3/quote/"+niceSymbol+"USD?apikey=4116b7eb972d010e408e5e350e723b1a"
        const resp = await axios.get(url)
        price = resp.data[0].price
        const cryptoCollection = await cryptocurrency()
        let crypto = await cryptoCollection.find({symbol:niceSymbol}).toArray()
        if(crypto.length===0){
            throw "not find any relative crypto"
        }
        crypto[0].coinHolders.forEach(element=>{
            if(element.userId===niceUserId) numberOfShares=element.numberOfCoins //change number of shares if there is the user
        });
        if(numberOfShares===0){
            //return an empty object if not found his/her shares number
            return {}
        }else{
            marketValue = price * numberOfShares
            return {"symbol":niceSymbol, "cryptoName":cryptoNames[niceSymbol],"lowerName":cryptoNames[niceSymbol].toLowerCase(),"coinHolders":numberOfShares,"currentPrice":price,"marketValue":marketValue}
        }
        

        
    },
    async searchAllCrypto(userId){
        //blur search from database
        let price, marketValue
        let cryptos = []
        let niceUserId = checkId(userId)
        const cryptoCollection = await cryptocurrency()
        let crypto = await cryptoCollection.find({coinHolders:{ $elemMatch: {userId:niceUserId}}}).toArray()
        // if(crypto.length===0){
        //     throw "not find any relative crypto"
        // }
        for(let i = 0; i < crypto.length;i++){
            for(let j=0;j<crypto[i].coinHolders.length;j++){
                if(crypto[i].coinHolders[j].userId===niceUserId && crypto[i].coinHolders[j].numberOfCoins !==0){
                    let url = "https://financialmodelingprep.com/api/v3/quote/"+crypto[i].symbol+"USD?apikey=14bf083323c7d4f37ef667f48d105a93"
                    let resp = await axios.get(url)
                    setTimeout(() => {
                        console.log("go_to_sleep")
                    }, 500);
                    price = resp.data[0].price
                    marketValue = price * crypto[i].coinHolders[j].numberOfCoins
                    cryptos.push({"symbol":crypto[i].symbol,"cryptoName":cryptoNames[crypto[i].symbol],"lowerName":cryptoNames[crypto[i].symbol].toLowerCase(),
                    "coinHolders":crypto[i].coinHolders[j].numberOfCoins,"currentPrice":price,"marketValue":marketValue})
                } 
            }
        }
        return cryptos

         
    },
    async getPrice(symbol){
        let niceSymbol = checkSymbol(symbol)
        let url = "https://financialmodelingprep.com/api/v3/quote/"+niceSymbol+"USD?apikey=14bf083323c7d4f37ef667f48d105a93"
        let resp = await axios.get(url)
        let price = resp.data[0].price
        let name = cryptoNames[niceSymbol]
        return {"price":price,"cryptoName":name}
    }
}