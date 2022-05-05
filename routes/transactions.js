const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const validation = require("../validation");

router.get('/', async(req,res) =>{
    if (req.session.user) {
        res.render("transaction", { currUser: req.session.user });
    }
});

router.post('/', async(req,res) =>{
    if (req.session.user) {
        res.render("transaction", { currUser: req.session.user });
    }
});

module.exports = router;