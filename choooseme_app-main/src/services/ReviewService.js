import {ApiContants} from '../contants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

const getReviews = async () => {
  console.log('ReviewService | getReviews');
  try {
    let response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.REVIEW}/`,
      {
        headers: authHeader(getToken()),
      },
    );
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
    return {
      status: false,
      message: 'Bookmark data not found',
    };
  }
};


export default {getReviews};
