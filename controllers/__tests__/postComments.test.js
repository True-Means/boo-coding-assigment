const { postComments } = require('../comment.controller'); // Import the function to be tested
const CommentModel = require('../../models/comment.model'); // Import the CommentModel

// Mock the CommentModel.create and FavoriteModel functions
CommentModel.create = jest.fn();

describe('postComments', () => {
  it('should create a new comment when valid data is provided', async () => {
    // Arrange
    const req = {
      body: {
        title: 'Just not an INTJ',
        description: 'I want Elon Musk to be an INTJ more than anyone',
        mbti: 'INTP',
        enneagram: '8w9',
        zodiac: 'Cancer',
        profileId: '653613ee9a0a75b59e0435c6'
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock CommentModel.create to return the created comment
    const newComment = new CommentModel(req.body);
    CommentModel.create.mockResolvedValue(newComment);

    // Act
    await postComments(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ code: 200, data: newComment });
  });
});