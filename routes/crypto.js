const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const data = require('../data');
const cryptoData = data.crpytos;


const { coinspot } = require("ccxt")
const req = require("express/lib/request")

router.get crypto user all coinspot
router.post req.date inputCryptoCode
router.post('/tradecrypto')
req.assetType

router.get('/',async(req,res)=>{
    try{
        let res = cryptoData.searchCrypto()
    }
})