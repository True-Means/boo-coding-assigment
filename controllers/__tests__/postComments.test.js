const {
  postComments,
} = require("../comment.controller");
const CommentModel = require("../../models/comment.model");
const FavoriteModel = require("../../models/favorites.model");

// Mock the models before running your tests.
jest.mock('../../models/comment.model', () => ({
    create: jest.fn(),
  }));
  
  jest.mock('../../models/favorites.model', () => ({
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    create: jest.fn(),
  }));

describe("postComments", () => {
  it("should create a new comment", async () => {
    const req = {
      body: {
        title: "test comment title",
        description: "test comment description",
        mbti: "INTP",
        enneagram: "1-2",
        zodiac: "Cancer",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    CommentModel.create.mockResolvedValue({
      title: "test comment title",
      description: "test comment description",
      mbti: "INTP",
      enneagram: "1-2",
      zodiac: "Cancer",
    });

    await postComments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      data: {
        title: "test comment title",
        description: "test comment description",
        mbti: "INTP",
        enneagram: "1-2",
        zodiac: "Cancer",
        profileId: "2ffqfefq23qffafqf",
      },
    });
  });
});
