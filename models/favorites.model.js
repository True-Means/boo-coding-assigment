const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    },
    profileId : {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamp: true,
  }
)

const Favorite = mongoose.model('favorites', favoriteSchema);

module.exports = Favorite;