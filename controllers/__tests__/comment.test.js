const { getComments, toggleLike, postComments } = require("../comment.controller");
const CommentModel = require("../../models/comment.model");
const FavoriteModel = require("../../models/favorites.model");
const {
  fakeCommentData1,
  fakeCommentData2,
  fakeCommentLikeData,
} = require("../../utils/faker-data");
const {
  validateResponseStatus,
  validateResponseJson,
} = require("../../utils/test-validators.utils");
const { dbConnect, dbDisconnect } = require("../../utils/dbHandler.utils");

CommentModel.aggregate = jest.fn();
CommentModel.create = jest.fn();

FavoriteModel.findOne = jest.fn();
FavoriteModel.deleteOne = jest.fn();
FavoriteModel.prototype.save = jest.fn();

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe("Comments API Test Suite", () => {
  it("should create a new comment when valid data is provided", async () => {
    const req = {
      body: fakeCommentData1,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const newComment = new CommentModel(req.body);
    CommentModel.create.mockResolvedValue(newComment);

    await postComments(req, res);

    validateResponseStatus(res.status, 200);
    validateResponseJson(res.json, { code: 200, data: newComment });
  });

  it("should return comments sorted by most favorites", async () => {
    const req = {
      body: {
        sortParam: "best",
        mbti: "INTP",
        enneagram: "8w9",
        zodiac: "Cancer",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockComments = [fakeCommentData1, fakeCommentData2];
    CommentModel.aggregate.mockResolvedValue(mockComments);

    await getComments(req, res);

    expect(CommentModel.aggregate).toHaveBeenCalledWith([
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
      {
        $sort: { favoriteCount: -1 },
      },
      {
        $match: {
          mbti: "INTP",
        },
      },
      {
        $match: {
          enneagram: "8w9",
        },
      },
      {
        $match: {
          zodiac: "Cancer",
        },
      },
    ]);
    validateResponseStatus(res.status, 200);
    validateResponseJson(res.json, { code: 200, data: mockComments });
  });

  it("should return comments sorted by most recent", async () => {
    const req = {
      body: {
        sortParam: "recent",
        mbti: "INTP",
        enneagram: "8w9",
        zodiac: "Cancer",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockComments = [fakeCommentData1, fakeCommentData2];
    CommentModel.aggregate.mockResolvedValue(mockComments);

    await getComments(req, res);

    expect(CommentModel.aggregate).toHaveBeenCalledWith([
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
      {
        $sort: { created_at: -1 },
      },
      {
        $match: {
          mbti: "INTP",
        },
      },
      {
        $match: {
          enneagram: "8w9",
        },
      },
      {
        $match: {
          zodiac: "Cancer",
        },
      },
    ]);

    validateResponseStatus(res.status, 200);
    validateResponseJson(res.json, { code: 200, data: mockComments });
  });

  it("should handle errors when getting comments", async () => {
    const req = {
      body: {
        sortParam: "best",
        mbti: "INTP",
        enneagram: "8w9",
        zodiac: "Cancer",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const errorMessage = "Error getting comments";
    CommentModel.aggregate.mockRejectedValue(errorMessage);

    await getComments(req, res);

    expect(CommentModel.aggregate).toHaveBeenCalledWith([
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
      {
        $sort: { favoriteCount: -1 },
      },
      {
        $match: {
          mbti: "INTP",
        },
      },
      {
        $match: {
          enneagram: "8w9",
        },
      },
      {
        $match: {
          zodiac: "Cancer",
        },
      },
    ]);

    validateResponseStatus(res.status, 500);
    validateResponseJson(res.json, { code: 500, msg: errorMessage });
  });

  it("should remove a favorite when it exists", async () => {
    const req = {
      body: fakeCommentLikeData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    FavoriteModel.findOne.mockResolvedValue({});

    await toggleLike(req, res);

    expect(FavoriteModel.findOne).toHaveBeenCalledWith(fakeCommentLikeData);
    expect(FavoriteModel.deleteOne).toHaveBeenCalledWith(fakeCommentLikeData);

    validateResponseStatus(res.status, 200);
    validateResponseJson(res.json, { code: 200, data: fakeCommentLikeData });
  });

  it("should add a favorite when it does not exist", async () => {
    const req = {
      body: fakeCommentLikeData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    FavoriteModel.findOne.mockResolvedValue(null);

    const newFavorite = new FavoriteModel(req.body);
    FavoriteModel.prototype.save.mockResolvedValue(newFavorite);

    await toggleLike(req, res);
    validateResponseStatus(res.status, 200);
    validateResponseJson(res.json, { code: 200, data: newFavorite });
  });

  it("should handle errors when toggling a favorite", async () => {
    const req = {
      body: fakeCommentLikeData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const errorMessage = "Error finding favorite";
    FavoriteModel.findOne.mockRejectedValue(errorMessage);

    await toggleLike(req, res);

    expect(FavoriteModel.findOne).toHaveBeenCalledWith(fakeCommentLikeData);
    
    validateResponseStatus(res.status, 500);
    validateResponseJson(res.json, { code: 500, msg: errorMessage });
  });
});
