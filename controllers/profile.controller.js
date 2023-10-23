const ProfileModel = require("../models/profile.model");

const createProfile = async (req, res) => {
  try {
    const newProfileData = req.body;
    console.log(newProfileData);
    const name = req.body.name;
    const checkProfile = await ProfileModel.findOne({ name });
    if (checkProfile)
      return res.status(400).json({
        message: "name already used",
      });
    const newProfile = new ProfileModel(newProfileData);
    await newProfile
      .save()
      .then((data) => {
        return res.status(200).json({ code: 200, data });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ code: 500, msg: error.toString() });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getProfileById = async (id) => {
  const profile = await ProfileModel.findById(id);
  if (profile) {
    return profile;
  } else {
    return null;
  }
};

module.exports = {
  createProfile,
  getProfileById,
};
