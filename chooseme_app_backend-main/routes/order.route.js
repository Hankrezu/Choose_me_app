var express = require("express");
const { getOrders, createOrder, removeCartItems, getOrderRestaurants, getOrderFoods, cancelOrder, reOrder } = require("../services/order.service");
var router = express.Router();

router.post("/:username", async (req, res) => {
  let { username } = req.params;
  let { restaurantId, total } = req.body;
  let response = await createOrder({ username, restaurantId, total });
  res.json(response);
});

router.get("/:username", async (req, res) => {
  let { username } = req.params;
  let response = await getOrders({ username });
  res.json(response);
});

router.delete("/:username", async (req, res) => {
  let { username } = req.params;
  let { restaurantId } = req.body;
  let response = await removeCartItems({ username, restaurantId });
  res.json(response);
});

router.get("/restaurants/:username", async (req, res) => {
  let { username } = req.params;
  let response = await getOrderRestaurants({ username });
  res.json(response);
});

router.get("/foods/:username/:orderId", async (req, res) => {
  let { username, orderId } = req.params;
  let response = await getOrderFoods({ username, orderId });
  res.json(response);
});
router.patch("/cancel/:username/:orderId", async (req, res) => {
  let { username, orderId } = req.params;
  let response = await cancelOrder({ username, orderId });
  res.json(response);
});

router.post("/reorder/:username/:orderId", async (req, res) => {
  let { username, orderId } = req.params;
  let response = await reOrder({ username, orderId });
  res.json(response);
});

module.exports = router;
