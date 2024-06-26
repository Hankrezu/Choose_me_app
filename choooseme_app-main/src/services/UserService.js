import {ApiContants} from '../contants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

const getUserData = async () => {
  console.log('UserService | getUserData');
  try {
    let userResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.USER}/get-user`,
      {
        headers: authHeader(getToken()),
      },
    );

    if (userResponse?.status === 200) {
      return {
        status: true,
        message: 'User data fetched',
        data: userResponse?.data,
      };
    } else {
      return {
        status: false,
        message: 'User data not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : 'User data not found',
    };
  }
};


const updateUserData = async (username, email, phone) => {
  console.log('UserService | updateUserData');
  try {
    let updateResponse = await axios.patch(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.USER}/update-user`,
      { username, email, phone },
      {
        headers: authHeader(getToken()),
      },
    );

    if (updateResponse?.status === 200) {
      return {
        status: true,
        message: 'User data updated successfully',
        data: updateResponse?.data,
      };
    } else {
      return {
        status: false,
        message: 'User data update failed',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : 'User data update failed',
    };
  }
};

const addAddress = async (username, address) => {
  console.log('UserService | addAddress');
  try {
    let addResponse = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.USER}/add-address`,
      { username, address },
      {
        headers: authHeader(getToken()),
      },
    );

    if (addResponse?.status === 200) {
      return {
        status: true,
        message: 'Address added successfully',
        data: addResponse?.data,
      };
    } else {
      return {
        status: false,
        message: 'Address addition failed',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : 'Address addition failed',
    };
  }
};

const checkAddressExist = async (username, address) => {
  console.log('UserService | checkAddressExist');
  try {
    let checkResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.USER}/check-address-exist`,
      {
        params: { username, address },
        headers: authHeader(getToken()),
      }
    );

    if (checkResponse?.status === 200) {
      return {
        status: true,
        message: 'Address check successful',
        data: checkResponse?.data,
      };
    } else {
      return {
        status: false,
        message: 'Address check failed',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : 'Address check failed',
    };
  }
};

const getAddress = async (username) => {
  console.log('UserService | getAddress');
  try {
    let addressResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.USER}/get-address`,
      {
        params: { username },
        headers: authHeader(getToken()),
      },
    );

    if (addressResponse?.status === 200) {
      return {
        status: true,
        message: 'User addresses fetched successfully',
        data: addressResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'User addresses not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : 'User addresses retrieval failed',
    };
  }
};

export default { getUserData, updateUserData, addAddress, checkAddressExist, getAddress };