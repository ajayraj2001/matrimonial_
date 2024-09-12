// const PurchaseSubscription = require("../../models/subscriptionPurchase");
// const PujaSubscription = require("../../models/pujaSubscriptionSchema");
const crypto = require("crypto");

const subscriptionWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  console.log(secret, "secret");
  // const secret = "skdhfsakhydfiawhiwhdsdsdesneow";
  try {
    const bodyString = JSON.stringify(req.body);
    // console.log(bodyString, "body");

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(bodyString);
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const event = req.body;
      console.log(event, "event+++++++++++++++++++++++++++");

      const paymentEntity = event.payload.payment.entity;
      console.log(paymentEntity.order_id, "order_id");

      if (event.event === "payment.captured") {
        console.log("Payment captured or authorized event received");

        const orderId = paymentEntity.order_id;
        if (!orderId) {
          console.error("Order ID is null. Cannot proceed.");
          return res
            .status(400)
            .json({ success: "error", message: "Order ID is null" });
        }

        const order = await PurchaseSubscription.findOneAndUpdate(
          { orderId },
          {
            success: "success",
            paymentId: paymentEntity.id,
          },
          { new: true }
        );

        if (order) {
          const event = await PujaSubscription.findById(order._id);
          event.purchasedNumber = event.purchasedNumber + 1;
          await event.save();
        }


      } else if (event.event === "payment.failed") {
        const orderId = paymentEntity.order_id;
        if (!orderId) {
          console.error("Order ID is null. Cannot proceed.");
          return res
            .status(400)
            .json({ success: "error", message: "Order ID is null" });
        }

        await PurchaseSubscription.findOneAndUpdate(
          { orderId },
          { orderStatus: "failed", paymentId: paymentEntity.id },
          { new: true }
        );
      }

      res.status(200).json({ success: "ok" });
    } else {
      res.status(400).json({ success: "invalid signature" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ success: "error", message: error.message });
  }
};

module.exports = subscriptionWebhook
