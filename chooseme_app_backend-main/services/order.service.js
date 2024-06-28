const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require("mongodb");

const createOrder = async ({ username, restaurantId, total }) => {
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
      total, // Store the total in the order
      createdAt: new Date(),
      status: 'PENDING',  // Add status field with default value 'PENDING'
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
            "total": 1,  // Total
            "status":1,  // Status of Order
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
      message: "Order Restaurants fetch failed",
    };
  }
};

const getOrderFoods = async ({ username, orderId }) => {
  try {
    const orderObjectId = new ObjectId(orderId);

    // Find the order
    let order = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .findOne({
        username: username,
        _id: orderObjectId
      });

    if (!order) {
      return {
        status: false,
        message: "Order not found",
      };
    }

    const foodIds = order.cartItems.map(item => new ObjectId(item.foodId));
    const foodCounts = order.cartItems.reduce((acc, item) => {
      acc[item.foodId] = item.count;
      return acc;
    }, {});

    // Fetch the food items corresponding to the foodIds in the order
    let orderFoods = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .find({
        _id: { $in: foodIds }
      })
      .project({
        "_id": 1,
        "name": 1,
        "price": 1,
        "image": 1,
        "categories": 1,
        "description": 1,
        "ingredients": 1,
        "updatedAt": 1,
      })
      .toArray();

    // Add the count from cartItems to the fetched foods
    orderFoods = orderFoods.map(food => {
      const count = foodCounts[food._id.toString()];
      return {
        ...food,
        count, // Add count from the order's cartItems
      };
    });

    if (orderFoods?.length > 0) {
      return {
        status: true,
        message: "Order Foods fetched successfully",
        data: orderFoods,
        total: order.total // Include the total price from the order
      };
    } else {
      return {
        status: false,
        message: "Order Foods not found",
      };
    }
  } catch (error) {
    console.error('Error fetching order foods:', error);
    return {
      status: false,
      message: "Order Foods fetch failed",
      error,
    };
  }
};

const cancelOrder = async ({ username, orderId }) => {
  try {
    const orderObjectId = new ObjectId(orderId);
    const result = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .updateOne(
        { _id: orderObjectId, username, status: 'PENDING' },
        { $set: { status: 'CANCELLED' } }
      );

    if (result.modifiedCount > 0) {
      return {
        status: true,
        message: "Order canceled successfully",
      };
    } else {
      return {
        status: false,
        message: "Order cancellation failed or order was not in PENDING status",
      };
    }
  } catch (error) {
    console.error('Error canceling order:', error);
    return {
      status: false,
      message: "Order cancellation failed",
      error,
    };
  }
};

const reOrder = async ({ username, orderId }) => {
  try {
    const orderObjectId = new ObjectId(orderId);

    // Find the order
    let order = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .findOne({ _id: orderObjectId, username });

    if (!order) {
      return { status: false, message: "Order not found" };
    }

    // Remove existing cart items for the specified restaurant
    await removeCartItems({ username, restaurantId: order.restaurantId });

    // Insert the items from the order back into the cart collection
    const cartItems = order.cartItems.map(item => ({
      ...item,
      username,
      restaurantId: order.restaurantId,
    }));

    await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .insertMany(cartItems);

    return { status: true, message: "Reordered successfully" };
  } catch (error) {
    return { status: false, message: "Reordering failed", error };
  }
};

const receivedOrder = async ({ username, orderId }) => {
  try {
    const orderObjectId = new ObjectId(orderId);
    const result = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .updateOne(
        { _id: orderObjectId, username, status: 'ONCOMING' },
        { $set: { status: 'DELIVERED' } }
      );

    if (result.modifiedCount > 0) {
      return {
        status: true,
        message: "Order marked as delivered successfully",
      };
    } else {
      return {
        status: false,
        message: "Order status update failed or order was not in ONCOMING status",
      };
    }
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    return {
      status: false,
      message: "Order status update failed",
      error,
    };
  }
};

module.exports = { createOrder, getOrders, removeCartItems, getOrderRestaurants, getOrderFoods, cancelOrder, reOrder, receivedOrder };



