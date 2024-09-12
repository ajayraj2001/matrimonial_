const Razorpay = require("razorpay");
const { RAZOR_KEY_ID_TEST, RAZOR_KEY_SECRET_TEST } = process.env;

const razorpay = new Razorpay({
  key_id: RAZOR_KEY_ID_TEST,
  key_secret: RAZOR_KEY_SECRET_TEST,
});

module.exports = razorpay;
