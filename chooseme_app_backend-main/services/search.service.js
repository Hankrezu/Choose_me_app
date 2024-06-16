const { response } = require("express");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

const getFoodByName = async (foodName) => {
    try {
      await MongoDB.connect();
     
      const regex = new RegExp(foodName, 'i');
  

      let foods = await MongoDB.db()
        .collection(mongoConfig.collections.FOODS)
        .find({ name: regex })
        .toArray();
  
      if (foods.length > 0) {
        
        for (let food of foods) {
          let categoryNames = food.categories.map(async (categoryId) => {
            let categoryDetail = await MongoDB.db()
              .collection(mongoConfig.collections.CATEGORIES)
              .findOne({ _id: ObjectId(categoryId) });
            return categoryDetail ? categoryDetail.name : null;
          });
  
          food.categories = await Promise.all(categoryNames);
        }
        
        return {
          status: true,
          message: "Foods found successfully",
          data: foods,
        };
      } else {
        return {
          status: false,
          message: "No Foods found",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Food finding failed",
        error: `Food finding failed: ${error?.message}`,
      };
    } finally {
      await MongoDB.close();
    }
  };

  module.exports = { getFoodByName,  };