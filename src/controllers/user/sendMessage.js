const { User, Message } = require("../../models");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError } = require("../../errorHandler");

const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId, message } = req.body;
  const senderId = req.user._id; // Assuming the authenticated user is the sender

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return next(new ApiError("Receiver not found", 404));
  }

  // Fetch the sender details
  const sender = await User.findById(senderId);

  if (!sender) {
    return next(new ApiError("Sender not found", 404));
  }

  // Check if the sender is subscribed
  if (!sender.isSubscribed) {
    // Check the number of messages already sent by this sender to this receiver
    const messageCount = await Message.countDocuments({
      senderId,
      receiverId,
    });

    // Limit to 3 messages if the sender is not subscribed
    if (messageCount >= 3) {
      return next(new ApiError("You have reached your message limit to this user. Please subscribe to send more messages.", 403));
    }
  }

  // Create and save the new message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  return res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
});

module.exports = { sendMessage };
