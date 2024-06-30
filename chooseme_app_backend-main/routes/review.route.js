var express = require('express');
const { getReviews, updateReview } = require('../services/review.service');
var router = express.Router();

router.get('/', async (req, res) => {
  let username = req?.username;
  let response = await getReviews({ username });
  res.json(response);
});

router.put('/update', async (req, res) => {
      const { reviewId, review, rate } = req.body;
      const response = await ReviewService.updateReview({ reviewId, review, rate });
      res.json(response);
  });
module.exports = router;
