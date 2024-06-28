var express = require("express");
const { getUserData, updateUserData, addAddress } = require("../services/user.service");
var router = express.Router();

router.get("/get-user", async (req, res) => {
  let username = req?.username;
  let response = await getUserData(username);
  res.json(response);
});

router.patch("/update-user", async (req, res) => {
  const { username, email, phone } = req.body;
  let response = await updateUserData(username, email, phone);
  res.json(response);
});

router.post("/add-address", async (req, res) => {
  const { username, address } = req.body;
  let response = await addAddress(username, address);
  res.json(response);
});

module.exports = router;
