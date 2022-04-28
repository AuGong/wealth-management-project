module.exports = {
  checkUsername(username, varName) {
    if (!username) throw `You must provide a ${varName}!`;
    if (typeof username !== "string") throw `${varName} must be a string!`;
    username = username.trim();
    let reg = /^[0-9a-zA-Z]{4,}$/;
    if (!reg.test(username)) throw `Invalid ${varName}!`;
    username = username.toLowerCase();
    return username;
  },
  
  checkPassword(password, varName) {
    if (!password) throw `You must provide a ${varName}!`;
    if (typeof password !== "string") throw `${varName} must be a string!`;
    password = password.trim();
    let reg = /^[\S]{6,}$/;
    if (!reg.test(password)) throw `Invalid ${varName}!`;
    return password;
  }
};