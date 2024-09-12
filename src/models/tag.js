const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hindiName: { type: String, default: "", unique: true }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;

