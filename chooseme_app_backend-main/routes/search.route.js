var express = require("express");
const { getFoodByName,
 } = require("../services/search.service");
var router = express.Router();


router.get("/:foodName", async (req, res) => {
  let foodName = req?.params?.foodName;
  let response = await getOneFoodById(foodName);
  res.json(response);
});

module.exports = router;
