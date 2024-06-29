var express = require("express");
const { getUserData, updateUserData, addAddress, checkAddressExist, getAddress } = require("../services/user.service");
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
  const { username, address } = req.body; // Get username and address from request body
  let response = await addAddress(username, address);
  res.json(response);
});

router.get("/check-address-exist", async (req, res) => {
  const { username, address } = req.query;
  let response = await checkAddressExist(username, address);
  res.json(response);
});

router.get("/get-address", async (req, res) => {
  let username = req?.username;
  let response = await getAddress(username);
  res.json(response);
});

module.exports = router;
