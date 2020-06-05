const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: false
  }
});

module.exports = mongoose.model("Document", documentSchema);
