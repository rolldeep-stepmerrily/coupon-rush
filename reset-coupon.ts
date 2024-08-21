import axios from 'axios';

export const resetCouponCount = async () => {
  try {
    await axios.post('http://localhost:3000/coupons/reset');
  } catch (e) {
    console.error(e);
  }
};
