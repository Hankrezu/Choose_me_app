const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getUserData = async (username) => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ name: username }); // Querying by name

    if (userObject) {
      return {
        status: true,
        message: "User found successfully",
        data: userObject,
      };
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "User finding failed",
      error: `User finding failed: ${error?.message}`,
    };
  }
};

const updateUserData = async (username, email, phone) => {
  try {
    const updateResult = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .updateOne(
        { name: username },
        { $set: { email: email, phone: phone } }
      );

    if (updateResult.matchedCount > 0) {
      return {
        status: true,
        message: "User updated successfully",
      };
    } else {
      return {
        status: false,
        message: "No user found to update",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "User update failed",
      error: `User update failed: ${error?.message}`,
    };
  }
};

const addAddress = async (username, address) => {
  try {
    const updateResult = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .updateOne(
        { name: username },
        { $push: { address: address } }
      );

    if (updateResult.matchedCount > 0) {
      return {
        status: true,
        message: "Address added successfully",
      };
    } else {
      return {
        status: false,
        message: "No user found to add address",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Add address failed",
      error: `Add address failed: ${error?.message}`,
    };
  }
};

module.exports = { getUserData, updateUserData, addAddress };
