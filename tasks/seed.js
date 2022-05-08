const data = require('../data');
const connection = require('../config/mongoConnection');
const { ObjectId } = require('mongodb');
const stocks = data.stocks;
const users = data.users;
const cryptocurrency = data.crpytos;
const cryptoNames = ['BTC','ETH','BNB','SOL','XRP','LUNA','ADA','DOGE','AVAX','DOT']



const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase(); 
    let newUser = await users.createUser("admin", "admin111111", "admin@hotmail.com", "Male");
    userid = newUser._id;
    for(let i = 0;i<cryptoNames.length;i++){
        await cryptocurrency.insertUser(
          new ObjectId(userid).toString(),
          "Crypto",
          cryptoNames[i],
          50,
          "Buy",
          234
        );
    }
    await connection.closeConnection();
    console.log('Done seeding databse!');
}
main().catch((error) => {
    console.log(error);
  });