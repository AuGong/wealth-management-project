const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const validation = require("../validation");

router.get('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect("/trade");
    }
    else {
        res.render("login", {
            title: 'Log In',
            authenticated: false,
        });
    }
});

router.get('/signup', async (req, res) => {
    if (req.session.user) {
        res.redirect("/trade");
    }
    else {
        res.render("signUp", {
            title: 'Sign Up',
            authenticated: false,
        });
    }
});

router.post('/signup', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let gender = req.body.gender;
    let errors = [];

    try {
        username = validation.checkUsername(username, "Username");
        password = validation.checkPassword(password, "Password");
        email = validation.checkEmail(email, "Email");
    } catch(e) {
        errors.push(e);
        return res.status(400).render('signup', {
            title: "Error",
            authenticated: false,
            errors: errors
        });
    }

    try {
        let signupResult = await userData.createUser(username, password, email, gender);
        if (!signupResult) {
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.redirect("/login");
        }
    } catch(e) {
        errors.push(e);
        return res.status(400).render("signup", {
          title: "Error",
          authenticated: false,
          errors: errors,
        });
    }

});

router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let errors = [];

    try {
        username = validation.checkUsername(username, "Username");
        password = validation.checkPassword(password, "Password");
    } catch(e) {
        errors.push(e);
        return res.status(400).render('login', {
            title: "Error",
            authenticated: false,
            errors: errors
        });
    }

    try {
        let loginResult = await userData.checkUser(username, password);
        if (loginResult.authenticated == true) {
            req.session.user = loginResult.user;
            res.redirect("/trade");
        }
    } catch(e) {
        errors.push(e);
        return res.status(400).render("login", {
          title: "Error",
          authenticated: false,
          errors: errors,
        });
    }
});

router.post("/editprofile", async (req, res) => {
    const updatedData = req.body;
    let errors = [];

    try {
        updatedData.username = validation.checkUsername(updatedData.username, "Username");
        updatedData.email = validation.checkEmail(updatedData.email, "Email");
    } catch (e) {
        errors.push(e);
        return res.status(400).render('editProfile', {
            title: "Error",
            errors: errors
        });
    }

    try {
        await userData.getUserById(req.session.user._id);
    } catch (e) {
        errors.push("User not found");
        return res.status(404).render('editProfile', {
            title: "Error",
            errors: errors
        });
    }

    try {
        const { username, email, gender } = updatedData;
        const updatedUser = await userData.updateUser(
          req.session.user._id,
          username,
          email,
          gender
        );
        if (!updatedUser) {
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            req.session.user = updatedUser;
            res.redirect("/user");
        }
    } catch (e) {
        errors.push(e);
        return res.status(500).render('editProfile', {
            title: "Error",
            errors: errors
        });
    }
});

router.get('/user', async (req, res) => {
    if (req.session.user) {
        res.render("user", {
            title: 'User Profile',
            currUser: req.session.user
        });
    }
});

router.get('/editprofile', async (req, res) => {
    if (req.session.user) {
        res.render("editProfile", {
            title: 'Edit Profile',
            currUser: req.session.user
        });
    }
});

router.get('/trade', async(req,res) =>{
    if (req.session.user) {
        res.render("trade", { currUser: req.session.user });
    }
});

router.get('/logout', async(req,res) =>{
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
