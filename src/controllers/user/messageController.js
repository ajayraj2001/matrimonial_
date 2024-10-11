const mongoose = require("mongoose");
const { User, Message } = require("../../models");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError } = require("../../errorHandler");


const chatList = asyncHandler(async (req, res, next) => {

  const userId = req.user._id;

  const recentChats = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { recipient: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      // Group by the other user in the conversation
      $group: {
        _id: {
          $cond: {
            if: { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
            then: '$recipient',
            else: '$sender'
          }
        },
        lastMessage: { $last: '$message' },
        lastMessageTime: { $last: '$timestamp' },
        unreadCount: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } }
      }
    },
    {
      // Sort by the most recent message time
      $sort: { lastMessageTime: -1 }
    },
    {
      // Lookup to get user details of the other user
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      // Unwind the user array
      $unwind: '$user'
    },
    {
      // Project the necessary fields, including the first image from profilePic array
      $project: {
        _id: 0,
        userId: '$_id',
        userName: '$user.fullName',
        userProfilePic: { $arrayElemAt: ['$user.profile_image', 0] }, // Get the first image from the array
        lastMessage: 1,
        lastMessageTime: 1,
        unreadCount: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    message: "Chats fetched successfully",
    data: recentChats,
  });

});


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


const getChatMessages  = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const { id : receiverId } = req.params;
  const { page = 1, limit = 30 } = req.query

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 30;

  const messages = await Message.find({
    $or: [
      { sender: senderId, recipient: receiverId },
      { sender: receiverId, recipient: senderId },
    ],
  })
    .sort({ timestamp: -1 }) 
    .skip((pageNum - 1) * limitNum) 
    .limit(limitNum)
    .exec();

  // Get the total number of messages for pagination info
  const totalMessages = await Message.countDocuments({
    $or: [
      { sender: senderId, recipient: receiverId },
      { sender: receiverId, recipient: senderId },
    ],
  });

  res.status(200).json({
    success: true,
    message: "Message sent successfully",
    data: messages,
    currentPage: pageNum,
    totalPages: Math.ceil(totalMessages / limitNum),
    totalMessages
  });

});


module.exports = {
  chatList, 
  sendMessage, 
  getChatMessages
};
