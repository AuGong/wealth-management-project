const express = require("express");
const router = express.Router();
const data = require("../data");
const statisticsData = data.statistics;

function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

router.get('/', async(req,res) =>{
    if (req.session.user) {
        res.render("statistics", {
          currUser: req.session.user,
        });
    }
});

router.get("/bardata", async (req, res) => {
  if (req.session.user) {
    userId = req.session.user._id;
    barData = await statisticsData.queryAllForStatistics(userId);
    stockxValues = [];
    stockyValues = [];
    stockbarColors = [];
    stockBarData = barData.stockArray;

    for (let i = 0; i < stockBarData.length; i++) {
      stockxValues.push(stockBarData[i].symbol);
      stockyValues.push(stockBarData[i].avenue);
      stockbarColors.push(getRandomColor());
    }

    cryptoxValues = [];
    cryptoyValues = [];
    cryptobarColors = [];
    cryptoBarData = barData.cryptoArray;

    for (let i = 0; i < cryptoBarData.length; i++) {
      cryptoxValues.push(cryptoBarData[i].symbol);
      cryptoyValues.push(cryptoBarData[i].avenue);
      cryptobarColors.push(getRandomColor());
    }

    res.json({
      stockxValues: stockxValues,
      stockyValues: stockyValues,
      stockbarColors: stockbarColors,
      cryptoxValues: cryptoxValues,
      cryptoyValues: cryptoyValues,
      cryptobarColors: cryptobarColors,
    });
  }
});

module.exports = router;
