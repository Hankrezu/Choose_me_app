const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");


const  getReviews  = async ({ username }) => {
  try {
    let reviews = await MongoDB.db
      .collection(mongoConfig.collections.REVIEWS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $addFields: {
            foodid: { $toObjectId: "$foodid" },
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "foodid",
            foreignField: "_id",
            as: "food",
          },
        },
        {
          $unwind: {
            path: "$food",
          },
        },
      ])
      .toArray();
      console.log(username)
    if (reviews?.length > 0) {
      return {
        status: true,
        message: "Reviews fetched Successfully",
        data: reviews,
      };
    } else {
      return {
        status: false,
        message: "Reviews not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Reviews fetching Failed",
    };
  }
};

module.exports = {  getReviews };
