var express = require("express");
const {
  getReviews
} = require("../services/review.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let username = req?.username;
  let response = await getReviews({ username });
  res.json(response);
});

module.exports = router;
