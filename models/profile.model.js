const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
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
    variant: {
      type: String,
    },
    tritype: {
      type: Number,
    },
    socionics: {
      type: String,
    },
    sloan: {
      type: String,
    },
    psyche: {
      type: String,
    },
    image: {
      type: String,
    }
  },
  {
    timestamp: true,
  }
);

const Profile = mongoose.model('profiles', profileSchema);

module.exports = Profile;
