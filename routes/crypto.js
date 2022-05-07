const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const cryptoData = data.crpytos;

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
    if(req.session.user){
        try{
            let data = await cryptoData.searchCrypto(req.symbol,req.session.user._id)
            res.render("crypto",{"cryptoCode":data.symbol, "cryptoName":data.cryptoName,"coinHolders":data.coinHolders,"currentPrice":data.currentPrice,"marketValue":data.marketValue})
        }catch(e){
            res.status(500).json({})
        }
    }

});
router.get('/getPrice/:symbol',async(req,res)=>{    
    //this response data will be processed by front end service, so no need to render
        try{
            let data = await cryptoData.getPrice(req.param.symbol)
            res.json({"price":data.price,"cryptoName":data.cryptoName})
        }catch(e){
            res.status(500).json({})
        }
    }
);

router.post('/tradecrypto',async(req,res)=>{
    if(req.session.user){
        let errors = []
        let tradeInfo = req.body
        //userId,symbol:inputStockCode,number:inputStockName,transType:inputTradeType,price:inputStockPrice
        if(!tradeInfo){
            errors.push('you must provide trade infomation')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if(!tradeInfo.inputAssetType||!tradeInfo.inputStockCode ||!tradeInfo.inputStockName||!tradeInfo.inputTradeType||!tradeInfo.inputStockPrice||!tradeInfo.inputQuantity){
            errors.push('you must provide assettype,stockcode,stockname,tradetype, tradeprice and quantity')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if(typeof tradeInfo.inputAssetType !=='string' || typeof tradeInfo.inputStockCode!=='string' || typeof tradeInfo.inputStockName !== 'string'|| typeof tradeInfo.inputTradeType !=='string'){
            errors.push('assettype,stockcode,stockname,tradetype must be a string')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if(tradeInfo.inputAssetType.trim().length ===0 || tradeInfo.inputStockCode.trim().length === 0 || tradeInfo.inputStockName.trim().length === 0|| tradeInfo.inputTradeType.trim().length === 0){
            errors.push('assettype,stockcode,stockname,tradetype cannot be empty spaces string')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        if( isNaN(Number(tradeInfo.inputStockPrice))|| isNaN(Number(tradeInfo.inputQuantity))){
            errors.push('stockPrice and quantity must be a number')
            res.status(400).render("trade",{errors:errors,currUser: req.session.user})
        }
        let userId=req.session.user._id;
        let assetType=tradeInfo.inputAssetType
        let symbol = tradeInfo.inputStockCode
        let number= tradeInfo.inputQuantity
        let transType = tradeInfo.inputTradeType
        let price = tradeInfo.inputStockPrice
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