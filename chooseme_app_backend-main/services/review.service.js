const { mongoConfig } = require('../config');
const MongoDB = require('./mongodb.service');

const getReviews = async ({ username }) => {
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
            foodid: { $toObjectId: '$foodid' },
          },
        },
        {
          $lookup: {
            from: 'foods',
            localField: 'foodid',
            foreignField: '_id',
            as: 'food',
          },
        },
        {
          $unwind: {
            path: '$food',
          },
        },
      ])
      .toArray();
    if (reviews?.length > 0) {
      return {
        status: true,
        message: 'Reviews fetched Successfully',
        data: reviews,
      };
    } else {
      return {
        status: false,
        message: 'Reviews not found',
      };
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      status: false,
      message: 'Reviews fetching Failed',
    };
  }
};
const updateReview = async ({ reviewId, review, rate }) => {
    const db = await MongoDB.getDatabase();
    const reviewsCollection = db.collection('reviews');
    
    const result = await reviewsCollection.updateOne(
      { _id: ObjectId(reviewId) },
      { $set: { review, rate, updatedAt: new Date() } }
    );
  
    return result.modifiedCount > 0;
  };
module.exports = { getReviews, updateReview };
