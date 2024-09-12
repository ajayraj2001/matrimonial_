const mongoose = require('mongoose');

const admin = new mongoose.Schema(
  {
    phone: { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, default: '' },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otp_expiry: { type: Date, default: Date.now },
    profile_image: { type: String, default: null },
    success: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'admins',
  }
);

const Admin = mongoose.model('Admin', admin);
module.exports = Admin;
// (async () => console.log(await require('bcrypt').hash('123456', await require('bcrypt').genSalt(10))))();
