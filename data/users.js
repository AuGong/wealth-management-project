const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const validation = require("../public/js/validation");
const bcrypt = require("bcryptjs");
const saltRounds = 5;
let { ObjectId } = require("mongodb"); 

module.exports = {
    async createUser(username, password, email, gender) {
        username = validation.checkUsername(username, "Username");
        password = validation.checkPassword(password, "Password");
        email = validation.checkEmail(email, "Email");
        gender = validation.checkNormalString(gender, "Gender");

        const userCollection = await users();
        let newUser = await userCollection.findOne({username: username});
        if (newUser) throw "That user already exisits!";
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        newUser = {
            username: username,
            email: email,
            gender: gender,
            password: hashedPassword
        };
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user.";
        
        const newId = insertInfo.insertedId;
        return await this.getUserById(newId.toString());  
    },

    async getUserById(userId) {
        userId = validation.checkNormalString(userId, "Database userId");

        const userCollection = await users();
        let user = await userCollection.findOne({ _id: ObjectId(userId) });
        if (user === null) throw 'No user with that id.';
        user._id = user._id.toString();
        return user;
    },

    async checkUser(username, password) {
        username = validation.checkUsername(username, "Username");
        password = validation.checkPassword(password, "Password");

        const userCollection = await users();
        let curUser = await userCollection.findOne({ username: username });
        if (!curUser) throw "Either the username or password is invalid!";

        let compareToMatch = await bcrypt.compare(password, curUser.password);
        if (!compareToMatch) throw "Either the username or password is invalid!";

        curUser._id = curUser._id.toString();
        return { authenticated: true, user: curUser };
    },

    async updateUser(id, username, email, gender) {
        id = validation.checkNormalString(id, "Database userId");
        username = validation.checkUsername(username, "Username");
        email = validation.checkEmail(email, "Email");
        gender = validation.checkNormalString(gender, "Gender");

        const userCollection = await users();
        const updateUser = {
            username: username,
            email: email,
            gender: gender
        };

        let databaseUser = await userCollection.findOne({ username: username });
        if (databaseUser && databaseUser._id.toString() !== id) throw "That user already exisits!";

        const updatedInfo = await userCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updateUser }
        );
        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
          throw "could not update user successfully";
        return await this.getUserById(id)
    }
}
