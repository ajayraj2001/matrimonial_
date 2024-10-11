const mongoose = require('mongoose');
const { Message } = require("../models");

const sendMessage = async (senderId, recipientId, messageText) => {
  const message = new Message({
    sender: senderId,
    recipient: recipientId,
    message: messageText,
  });

  await message.save();
  return message;
};

const editMessage = async (messageId, newMessageText, userId) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: userId, deletedForEveryone: false },
    { message: newMessageText, edited: true },
    { new: true }
  );
  return message;
};

const deleteForEveryone = async (messageId, userId) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: userId },
    { deletedForEveryone: true },
    { new: true }
  );
  return message;
};

const deleteForMe = async (messageId, userId) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId },
    { deletedForUser: true },
    { new: true }
  );
  return message;
};

module.exports = {
  sendMessage,
  editMessage,
  deleteForEveryone,
  deleteForMe,
};
