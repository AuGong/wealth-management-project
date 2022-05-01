const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const validation = require("../validation");
const bcrypt = require("bcryptjs");
const saltRounds = 5;
const uuid = require('uuid');

module.exports = {
    async createUser(username, password, email, gender) {
        username = validation.checkUsername(username, "Username");
        password = validation.checkPassword(password, "Password");

        const userCollection = await users();
        let newUser = await userCollection.findOne({username: username});
        if (newUser) throw "That user already exisits!";
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        newUser = {
            _id: uuid.v4(),
            username: username,
            email: email,
            gender: gender,
            password: hashedPassword
        };
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user.";
        return { userInserted: true };
    },

    async checkUser(username, password) {
        username = validation.checkUsername(username, "Username");
        password = validation.checkPassword(password, "Password");

        const userCollection = await users();
        let curUser = await userCollection.findOne({ username: username });
        if (!curUser) throw "Either the username or password is invalid!";

        let compareToMatch = await bcrypt.compare(password, curUser.password);
        if (!compareToMatch) throw "Either the username or password is invalid!";
        return { authenticated: true };
    }
}
