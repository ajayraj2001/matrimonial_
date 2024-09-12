const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  search: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const recentSearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  searches: [searchSchema],
});

const RecentSearch = mongoose.model("RecentSearch", recentSearchSchema);

module.exports = RecentSearch;
