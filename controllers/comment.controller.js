const CommentModel = require("../models/comment.model");
const FavoriteModel = require("../models/favorites.model");

const postComments = async (req, res) => {
  let newComment = req.body;
  CommentModel.create(newComment)
    .then((data) => {
      res.status(200).json({ code: 200, data });
    })
    .catch((err) => {
      res.status(500).json({ code: 500, msg: err.toString() });
    });
};

const toggleLike = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const profileId = req.body.profileId;
    const favorite = await FavoriteModel.findOne({
      commentId: commentId,
      profileId: profileId,
    });

    if (favorite) {
      const data = await FavoriteModel.deleteOne({
        commentId: commentId,
        profileId: profileId,
      });
      res.status(200).json({
        code: 200,
        data: { commentId: commentId, profileId: profileId },
      });
    } else {
      const newFavorite = new FavoriteModel({
        commentId: commentId,
        profileId: profileId,
      });
      await newFavorite
        .save()
        .then((data) => {
          return res.status(200).json({ code: 200, data });
        })
        .catch((error) => {
          return res.status(500).json({ code: 500, msg: error.toString() });
        });
    }
  } catch (err) {
    return res.status(500).json({ code: 500, msg: err.toString() });
  }
};

const getComments = async (req, res) => {
  try {
    const sortParam = req.body.sortParam || "best";
    const mbti = req.body.mbti || "";
    const enneagram = req.body.enneagram || "";
    const zodiac = req.body.zodiac || "";

    let aggregatePipeline = [
      {
        $lookup: {
          from: "favorites",
          localField: "_id",
          foreignField: "commentId",
          as: "favorite",
        },
      },
      {
        $addFields: {
          favoriteCount: { $size: "$favorite" },
        },
      },
    ];
    if (sortParam == "best") {
      aggregatePipeline.push({
        $sort: { favoriteCount: -1 }, // Sort in descending order for most favorites
      });
    } else if (sortParam == "recent") {
      aggregatePipeline.push({
        $sort: { created_at: -1 }, // Sort by the created_at field for most recent
      });
    }
    if (mbti !== "") {
      aggregatePipeline.push({
        $match: { mbti: mbti },
      });
    }
    if (enneagram !== "") {
      aggregatePipeline.push({
        $match: { enneagram: enneagram },
      });
    }
    if (zodiac !== "") {
      aggregatePipeline.push({
        $match: { zodiac: zodiac },
      });
    }

    const data = await CommentModel.aggregate(aggregatePipeline);
    res.status(200).json({ code: 200, data });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.toString() });
  }
return res.status(200);
};

module.exports = {
  postComments,
  toggleLike,
  getComments,
};
