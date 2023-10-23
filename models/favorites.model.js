const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    commentId: {
      type: String,
      required: true,
      unique: true,
    },
    profileId : {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamp: true,
  }
)

const Favorite = mongoose.model('favorites', favoriteSchema);

module.exports = Favorite;