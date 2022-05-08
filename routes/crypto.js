const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const cryptoData = data.crpytos;
const xss = require ('xss');


router.get('/',async(req,res)=>{
    errors = [];
    if(req.session.user){
        try{
            let result = await cryptoData.searchAllCrypto(req.session.user._id)
            res.render("crypto", {cryptos: result, currUser: req.session.user})
        }catch(e){
            errors.push(e)
            res.status(500).render("crypto",{errors: errors, currUser: req.session.user})
        }
    }
    
    
});

router.post('/',async(req,res)=>{
    errors=[]
    if(req.session.user){
        let data = req.body
        let symbol = xss(data.inputStockCode)
        try{
            let data = await cryptoData.searchCrypto(symbol,req.session.user._id)
            res.render("crypto",{"cryptoCode":data.symbol, "cryptoName":data.cryptoName,"coinHolders":data.coinHolders,"currentPrice":data.currentPrice,"marketValue":data.marketValue,currUser: req.session.user})
        }catch(e){
            res.render("crypto",{errors:errors,currUser: req.session.user})
        }
    }

});
router.get('/getPrice/:symbol',async(req,res)=>{    
    //this response data will be processed by front end service, so no need to render
        try{
            let data = await cryptoData.getPrice(req.params.symbol)
            res.json([{"price":data.price,"name":data.cryptoName}])
        }catch(e){
            res.json([])
        }
    }
);

router.post('/tradecrypto',async(req,res)=>{
    if(req.session.user){
        let errors = []
        let tradeInfo = req.body
        //userId,symbol:inputStockCode,number:inputStockName,transType:inputTradeType,price:inputStockPrice
        
        let userId=req.session.user._id;
        let assetType=xss(tradeInfo.inputAssetType)
        let symbol = xss(tradeInfo.inputStockCode)
        let number= xss(tradeInfo.inputQuantity)
        let transType = xss(tradeInfo.inputTradeType)
        let price = xss(tradeInfo.inputStockPrice)
        let name = xss(tradeInfo.inputStockName)
        
        if(!tradeInfo){
            errors.push('you must provide trade infomation')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if(!assetType||!symbol ||!name||!transType||!price||!number){
            errors.push('you must provide assettype,stockcode,stockname,tradetype, tradeprice and quantity')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if(typeof assetType !=='string' || typeof symbol!=='string' || typeof name !== 'string'|| typeof transType !=='string'){
            errors.push('assettype,stockcode,stockname,tradetype must be a string')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if(assetType.trim().length ===0 || symbol.trim().length === 0 || name.trim().length === 0|| transType.trim().length === 0){
            errors.push('assettype,stockcode,stockname,tradetype cannot be empty spaces string')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if( isNaN(Number(price))|| isNaN(Number(number))){
            errors.push('stockPrice and quantity must be a number')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        
        try{
            await cryptoData.insertUser(userId,assetType,symbol,number,transType,price)
            res.redirect("/trade");
            }catch(e){
                errors.push(e)
                res.status(500).render("trade",{errors: errors,currUser: req.session.user})
            }
    }



});
module.exports = router;