const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const validation = require("../validation");

router.get('/transaction', async(req,res) =>{
    if (req.session.user) {
        res.render("transaction", { currUser: req.session.user });
    }
});

router.post('/transaction', async(req,res) =>{
    if (req.session.user) {
        res.render("transaction", { currUser: req.session.user });
    }
});

router.get('/logout', async(req,res) =>{
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
