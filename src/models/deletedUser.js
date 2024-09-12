const mongoose = require('mongoose');

const deletedAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deletedReason:{
     type: String,
     required: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone:{
  type: String,
  required: true
  },
  deletedAt: {
    type: Date,
    default: Date.now
  }
});

const DeletedAccount = mongoose.model('DeletedAccount', deletedAccountSchema);

module.exports = DeletedAccount;
