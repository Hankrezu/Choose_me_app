import { ApiContants } from '../contants';
import axios from 'axios';
import { authHeader } from '../utils/Generator';
import { getToken } from '../Store';

const getOrders = async ({ username }) => {
  console.log('OrderService | getOrders');
  try {
    let response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}`,
      {
        headers: authHeader(getToken()),
        params: { username }, // Pass username as query parameter
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order data fetched',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Order data not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Order data not found',
    };
  }
};

const createOrder = async ({ username, restaurantId, total }) => {
  console.log('OrderService | createOrder');
  try {
    let response = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/${username}`,
      { restaurantId, total },
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order placed successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Order placement failed',
      };
    }
  } catch (error) {
    console.log(error?.response);
    return {
      status: false,
      message: 'Order placement failed',
    };
  }
};

const removeCartItems = async ({ username, restaurantId }) => {
  console.log('OrderService | removeCartItems');
  try {
    let response = await axios.delete(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/${username}`,
      {
        headers: authHeader(getToken()),
        data: { restaurantId }, // Pass restaurantId as request body
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Items removed from cart successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Failed to remove items from cart',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Failed to remove items from cart',
    };
  }
};

const getOrderRestaurants = async ({ username }) => {
  console.log('OrderService | getOrderRestaurants');
  try {
    let response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/restaurants/${username}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order restaurants fetched successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Order restaurants not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Order restaurants fetch failed',
    };
  }
};

const getOrderFoods = async ({ username, orderId }) => {
  console.log('OrderService | getOrderFoods');
  try {
    let response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/foods/${username}/${orderId}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order foods fetched successfully',
        data: response?.data?.data,
        total: response?.data?.total, // Ensure total is included in the response
      };
    } else {
      return {
        status: false,
        message: 'Order foods not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Order foods fetch failed',
    };
  }
};
const cancelOrder = async ({ username, orderId }) => {
  console.log('OrderService | cancelOrder');
  try {
    let response = await axios.patch(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/cancel/${username}/${orderId}`,
      null,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order canceled successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Failed to cancel order',
      };
    }
  } catch (error) {
    console.error('Error canceling order:', error);
    return {
      status: false,
      message: 'Failed to cancel order',
    };
  }
};


const reOrder = async ({ username, orderId }) => {
  console.log('OrderService | reOrder');
  try {
    let response = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/reorder/${username}/${orderId}`,
      null,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Reorder successful',
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: 'Reorder failed',
      };
    }
  } catch (error) {
    console.error('Error reordering:', error);
    return {
      status: false,
      message: 'Reorder failed',
    };
  }
};

const receivedOrder = async ({ username, orderId }) => {
  console.log('OrderService | receivedOrder');
  try {
    let response = await axios.patch(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/received/${username}/${orderId}`,
      null,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order marked as received successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Failed to mark order as received',
      };
    }
  } catch (error) {
    console.error('Error marking order as received:', error);
    return {
      status: false,
      message: 'Failed to mark order as received',
    };
  }
};

export default { getOrders, createOrder, removeCartItems, getOrderRestaurants, getOrderFoods, cancelOrder, reOrder, receivedOrder };

