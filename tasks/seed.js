const data = require('../data');
const connection = require('../config/mongoConnection');
const { ObjectId } = require('mongodb');
const stocks = data.stocks;
const users = data.users;
const cryptocurrency = data.crpytos;
const transactions = data.transactions;
const cryptoNames = ['BTC','ETH','BNB','SOL','XRP','LUNA','ADA','DOGE','AVAX','DOT']



const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase(); 
    const stock1 = await stocks.createStock("AAPL");
    const stock2 = await stocks.createStock("FB");
    const stock3 = await stocks.createStock("TSLA");
    const stock4 = await stocks.createStock("AMZN");
    const stock5 = await stocks.createStock("UA");
    const stock6 = await stocks.createStock("WBD");
    const stock7 = await stocks.createStock("GT");
    for(let i = 0;i<cryptoNames.length;i++){
        await cryptocurrency.insertUser((new ObjectId()).toString(),'Crypto',cryptoNames[i],50,'Buy',234)
    }
    await connection.closeConnection();
    console.log('Done seeding databse!');
}
main().catch((error) => {
    console.log(error);
  });