const { Subscription, SubscriptionPlan } = require("../../models");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError } = require("../../errorHandler");

const purchaseSubscription = asyncHandler(async (req, res, next) => {
  const { plan, duration } = req.body;

  const user = req.user;

  const subscriptionPlan = await SubscriptionPlan.findById(plan);

  if (!subscriptionPlan) {
    return next(new ApiError("Subscription plan not found", 404));
  }

  // Calculate the end date based on the duration
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + parseInt(duration));
  endDate.setHours(23, 59, 59, 999);

  user.subscriptionExpiryDate = endDate;
  user.isSubscribed = true;

  await user.save();

  const subscription = await Subscription.create({
    user : user._id,
    plan,
    startDate,
    endDate,
    status: "active",
  });

  return res.status(201).json({
    success: true,
    message: "Subscription bought successfully",
    data: subscription,
  });
});

module.exports = { 
    purchaseSubscription 
};
