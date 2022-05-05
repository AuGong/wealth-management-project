const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const validation = require("../validation");

router.get('/', async(req,res) =>{
    if (req.session.user) {
        res.render("statistics", { currUser: req.session.user });
    }
});

module.exports = router;
