const mongoose = require('mongoose');

const appData = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: null },
  },
  {
    timestamps: false,
    collection: 'appData',
  }
);

const AppData = mongoose.model('AppData', appData);
module.exports = AppData;
