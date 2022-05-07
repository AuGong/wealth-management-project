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
  xValues = [];
  yValues = [];
  barColors = [];
  for (let i = 0; i < barData.length; i++) {
    xValues.push(barData[i].symbol);
    yValues.push(barData[i].avenue);
    barColors.push(getRandomColor());
  }
  res.json({ xValues: xValues, yValues: yValues, barColors: barColors });
  }
});

module.exports = router;
