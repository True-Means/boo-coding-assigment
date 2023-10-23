const { getComments } = require('../comment.controller'); // Import the function to be tested
const CommentModel = require('../../models/comment.model'); // Import the CommentModel

// Mock the CommentModel.aggregate function
CommentModel.aggregate = jest.fn();

describe('getComments', () => {
  it('should return comments sorted by most favorites', async () => {
    // Arrange
    const req = {
      body: {
        sortParam: 'best',
        mbti: 'INTP',
        enneagram: '8w9',
        zodiac: 'Cancer',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock CommentModel.aggregate to return a list of comments
    const mockComments = [{
      _id: "6536425fa2cbe03e96e6865e",
      title: "He’s definitely an INTP",
      description:
        "He thinks about future, Ni. He is productive too, Te. That makes him INTJ ",
      mbti: "INTP",
      enneagram: "8w9",
      zodiac: "Cancer",
      profileId: "653613ee9a0a75b59e0435c6",
      created_at: "2023-10-23T09:51:29.039Z",
      favorite: [],
      favoriteCount: 0,
    }];
    CommentModel.aggregate.mockResolvedValue(mockComments);

    // Act
    await getComments(req, res);

    // Assert
    expect(CommentModel.aggregate).toHaveBeenCalledWith([
      {
        $lookup: {
          from: 'favorites',
          localField: '_id',
          foreignField: 'commentId',
          as: 'favorite',
        },
      },
      {
        $addFields: {
          favoriteCount: { $size: '$favorite' },
        },
      },
      {
        $sort: { favoriteCount: -1 },
      },      
      {
        $match: {
          mbti: 'INTP',
        }
      },
      {
        $match: {
          enneagram: '8w9',
        }
      },
      {
        $match: {
          zodiac: 'Cancer',
        },
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ code: 200, data: mockComments });
  });

  it('should return comments sorted by most recent', async () => {
    // Arrange
    const req = {
      body: {
        sortParam: 'recent',
        mbti: 'INTP',
        enneagram: '8w9',
        zodiac: 'Cancer',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock CommentModel.aggregate to return a list of comments
    const mockComments = [{
      _id: "6536425fa2cbe03e96e6865e",
      title: "He’s definitely an INTP",
      description:
        "He thinks about future, Ni. He is productive too, Te. That makes him INTJ ",
      mbti: "INTP",
      enneagram: "8w9",
      zodiac: "Cancer",
      profileId: "653613ee9a0a75b59e0435c6",
      created_at: "2023-10-23T09:51:29.039Z",
      favorite: [],
      favoriteCount: 0,
    }];
    CommentModel.aggregate.mockResolvedValue(mockComments);

    // Act
    await getComments(req, res);

    // Assert
    expect(CommentModel.aggregate).toHaveBeenCalledWith([
      {
        $lookup: {
          from: 'favorites',
          localField: '_id',
          foreignField: 'commentId',
          as: 'favorite',
        },
      },
      {
        $addFields: {
          favoriteCount: { $size: '$favorite' },
        },
      },
      {
        $sort: { created_at: -1 },
      },      
      {
        $match: {
          mbti: 'INTP',
        }
      },
      {
        $match: {
          enneagram: '8w9',
        }
      },
      {
        $match: {
          zodiac: 'Cancer',
        },
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ code: 200, data: mockComments });
  });

  it('should handle errors when getting comments', async () => {
    // Arrange
    const req = {
      body: {
        sortParam: 'best',
        mbti: 'INTP',
        enneagram: '8w9',
        zodiac: 'Cancer',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock CommentModel.aggregate to reject with an error
    const errorMessage = 'Error getting comments';
    CommentModel.aggregate.mockRejectedValue(errorMessage);

    // Act
    await getComments(req, res);

    // Assert
    expect(CommentModel.aggregate).toHaveBeenCalledWith([
      {
        $lookup: {
          from: 'favorites',
          localField: '_id',
          foreignField: 'commentId',
          as: 'favorite',
        },
      },
      {
        $addFields: {
          favoriteCount: { $size: '$favorite' },
        },
      },
      {
        $sort: { favoriteCount: -1 },
      },     
      {
        $match: {
          mbti: 'INTP',
        }
      },
      {
        $match: {
          enneagram: '8w9',
        }
      },
      {
        $match: {
          zodiac: 'Cancer',
        },
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ code: 500, msg: errorMessage });
  });
});
