const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  itemId: String,
  senderEmail: String,
  receiverEmail: String,
  message: String,
  contact: String   
});

module.exports = mongoose.model("Message", messageSchema);