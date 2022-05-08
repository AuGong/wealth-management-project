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
  },

  checkEmail(email, varName) {
    if (!email) throw `You must provide a ${varName}!`;
    if (typeof email !== "string") throw `${varName} must be a string!`;
    email = email.trim();
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email)) throw `Invalid ${varName}!`;
    email = email.toLowerCase();
    return email;
  },

  checkNormalString(strVal, varName) {
    if (!strVal) throw `You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },
};
