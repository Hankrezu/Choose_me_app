import { ApiContants } from '../contants';
import axios from 'axios';
import { authHeader } from '../utils/Generator';
import { getToken } from '../Store';

const getReviews = async () => {
  console.log('ReviewService | getReviews');
  try {
    const token = await getToken();
    const headers = authHeader(token);
    const url = `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.REVIEW}/`;
    console.log(`Fetching reviews from: ${url}`); // Debug URL
    let response = await axios.get(url, { headers });
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Review data fetched',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Review data not found',
      };
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      status: false,
      message: 'Review data not found',
    };
  }
};

const updateReview = async (reviewId, review, rate) => {
    try {
      const response = await axios.put(`${config.BACKEND_API.BASE_API_URL}/review/update`, { reviewId, review, rate });
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };

export default { getReviews,updateReview };
