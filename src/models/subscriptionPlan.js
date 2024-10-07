const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionPlanSchema = new Schema({
  planName: { type: String, enum: ['Basic', 'Standard', 'Premium'], required: true },
  price: { type: String, required: true },
  durationInDays: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

module.exports = SubscriptionPlan;
