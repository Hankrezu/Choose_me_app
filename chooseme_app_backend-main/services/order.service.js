const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const createOrder = async ({ username, restaurantId }) => {
  try {
    let cartItems = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .find({ username, restaurantId })
      .toArray();

    if (cartItems.length === 0) {
      return { status: false, message: "No items in cart to order from this restaurant" };
    }

    let order = {
      username,
      restaurantId,
      cartItems,
      createdAt: new Date(),
    };

    let result = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .insertOne(order);

    if (result.insertedCount > 0) {
      await removeCartItems({ username, restaurantId });
      return {
        status: true,
        message: "Order placed successfully",
        data: order,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Order creation failed",
      error,
    };
  }
};

const removeCartItems = async ({ username, restaurantId }) => {
  try {
    await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .deleteMany({ username, restaurantId });
    return {
      status: true,
      message: "Cart items removed successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: "Removing cart items failed",
      error,
    };
  }
};

const getOrders = async ({ username }) => {
  try {
    let orders = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .find({ username })
      .toArray();

    if (orders.length > 0) {
      return {
        status: true,
        message: "Orders fetched successfully",
        data: orders,
      };
    } else {
      return {
        status: false,
        message: "No orders found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Fetching orders failed",
      error,
    };
  }
};

const getOrderRestaurants = async ({ username }) => {
  try {
    let orderRestaurants = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $addFields: {
            restaurantId: { $toObjectId: "$restaurantId" },
          },
        },
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurantId",
            foreignField: "_id",
            as: "restaurants",
          },
        },
        {
          $unwind: "$restaurants",
        },
        {
          $project: {
            "_id": 1,
            "username": 1,
            "restaurantId": 1,
            "createdAt": 1,
            "restaurants": 1,
          },
        },
      ])
      .toArray();

    if (orderRestaurants?.length > 0) {
      return {
        status: true,
        message: "Order Restaurants fetched successfully",
        data: {
          orderRestaurants,
        },
      };
    } else {
      return {
        status: false,
        message: "Order Restaurants not found",
      };
    }
  } catch (error) {
    console.error('Error fetching order restaurants:', error);
    return {
      status: false,
      message: "Order Restaurants fetched failed",
    };
  }
};

const getOrderCartItems = async ({ orderId, username }) => {
  try {
    let order = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .findOne({ _id: new ObjectId(orderId), username });

    if (!order) {
      return {
        status: false,
        message: "Order not found",
      };
    }

    let cartItems = order.cartItems;
    let foodIds = cartItems.map(item => new ObjectId(item.foodId));

    let foods = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .find({ _id: { $in: foodIds } })
      .toArray();

    let cartItemsWithFood = cartItems.map(item => {
      let food = foods.find(food => food._id.equals(new ObjectId(item.foodId)));
      return {
        ...item,
        food: food,
      };
    });

    return {
      status: true,
      message: "Cart items fetched successfully",
      data: cartItemsWithFood,
    };
  } catch (error) {
    console.error('Error fetching cart items for order:', error);
    return {
      status: false,
      message: "Fetching cart items failed",
      error,
    };
  }
};


module.exports = { createOrder, getOrders, removeCartItems, getOrderRestaurants, getOrderCartItems };

