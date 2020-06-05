const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    min: 4,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 4
  },
  campaigns: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign"
      }
    ],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);
