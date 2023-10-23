require('text-encoding');
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    mbti: {
      type: String,
    },
    enneagram: {
      type: String,
    },
    zodiac : {
      type: String,
    },
    profileId : {
      type: mongoose.Schema.Types.ObjectId,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    }
  },
  {
    timestamp: true,
  }
)

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;