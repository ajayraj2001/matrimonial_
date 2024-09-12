const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    subject: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  },
  {
    timestamps: true 
  }
);

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
