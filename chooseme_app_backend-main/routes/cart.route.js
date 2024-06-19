var express = require("express");
const {
  addToCart,
  removeFromCart,
  getCartItems,
  getCartRestaurant,
  getCartItemsByRestaurant,
  removeAllCart,
  removeOneCart
} = require("../services/cart.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let username = req?.username;
  let response = await getCartItems({ username });
  res.json(response);
});

router.post("/:foodId", async (req, res) => {
  let { foodId } = req.params;
  let { restaurantId } = req.body;
  let username = req.username;
  let response = await addToCart({ foodId, restaurantId, username });
  res.json(response);
});

router.delete("/:foodId", async (req, res) => {
  let { foodId } = req?.params;
  let username = req?.username;
  let response = await removeFromCart({ foodId, username });
  res.json(response);
});

router.get("/restaurants", async (req, res) => {
  let username = req?.username;
  let response = await getCartRestaurant({ username });
  res.json(response);
});

router.get("/:restaurantId", async (req, res) => {
  let { restaurantId } = req.params;
  let username = req?.username;
  let response = await getCartItemsByRestaurant({ username, restaurantId });
  res.json(response);
});

// New Routes
router.delete("/", async (req, res) => {
  let username = req?.username;
  let response = await removeAllCart({ username });
  res.json(response);
});

router.delete("/restaurant/:restaurantId", async (req, res) => {
  let { restaurantId } = req.params;
  let username = req?.username;
  let response = await removeOneCart({ username, restaurantId });
  res.json(response);
});

module.exports = router;
