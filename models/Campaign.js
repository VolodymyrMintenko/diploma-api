const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date
  },
  minutesPlayed: {
    type: Number,
    default: 0
  },
  documents: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
      }
    ],
    default: []
  }
});

module.exports = mongoose.model("Campaign", campaignSchema);
