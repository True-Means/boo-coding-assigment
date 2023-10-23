"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  createProfile,
  getProfileById,
} = require("../controllers/profile.controller");
const {
  postComments,
  getComments,
  toggleLike,
} = require("../controllers/comment.controller");

const profiles = [
  {
    id: 1,
    name: "A Martinez",
    description: "Adolph Larrue Martinez III.",
    mbti: "ISFJ",
    enneagram: "9w3",
    variant: "sp/so",
    tritype: 725,
    socionics: "SEE",
    sloan: "RCOEN",
    psyche: "FEVL",
    image: "https://soulverse.boo.world/images/1.png",
  },
];

module.exports = function () {
  router.get("/:id", function (req, res) {
    const id = req.params.id;
    const profile = getProfileById(id);
    res.render("profile_template", {
      profile: profile,
    });
  });
  router.get("/temp", function (req, res, next) {
    const id = req.params.id;
    const profile = profiles[0];
    res.render("profile_template", {
      profile: profile,
    });
  });

  router.post("/createProfile", createProfile);

  router.post("/postComments", postComments);
  router.get("/getComments", getComments);
  router.post("/toggleLike", toggleLike);

  return router;
};
