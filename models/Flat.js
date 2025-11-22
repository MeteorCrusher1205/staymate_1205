const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user (owner)
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  flataddress: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // createdAt & updatedAt auto-managed

module.exports = mongoose.model("Flat", flatSchema);
