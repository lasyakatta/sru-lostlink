const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  type: String, // "lost" or "found"
  contact: String,
  userEmail: String
});

module.exports = mongoose.model("Item", itemSchema);