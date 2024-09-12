const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    profile_for: { type: String, default: '' },
    email: { type: String, trim: true, required: true },
    fullName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, required: true },
    profile_image: [{ type: String }],
    otp: { type: String, default: null },
    otp_expiry: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },

    // Extended profile fields
    dob: { type: Date, default: ''},
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    marital_status: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    height: { type: Number,default: ''}, // in cm
    country: { type: String,default: ''},
    state: { type: String ,default: ''},
    district: { type: String ,default: ''},
    highest_education: { type: String,default: ''},
    college_name: { type: String,default: ''},
    company_name: { type: String,default: '' },
    employed_in: { type: String ,default: ''}, // e.g., 'Private', 'Government', 'Business', etc.
    occupation: { type: String,default: ''},
    annual_income: { type: String ,default: ''}, // Could be a range or exact value
    mother_tongue: { type: String,default: ''},
    religion: { type: String,default: ''},
    caste: { type: String,default: ''},
    thoughts_on_horoscope: { type: String ,default: ''}, // e.g., 'Not Important', 'Important', etc.
    manglik: { type: String,default: ''},
    description: { type: String, default: '' },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'users',
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
