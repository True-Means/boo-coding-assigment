const { toggleLike } = require('../comment.controller'); // Import the function to be tested
const FavoriteModel = require('../../models/favorites.model'); // Import the FavoriteModel

// Mock the FavoriteModel.findOne, FavoriteModel.deleteOne, and FavoriteModel.create functions
FavoriteModel.findOne = jest.fn();
FavoriteModel.deleteOne = jest.fn();
FavoriteModel.prototype.save = jest.fn();
describe('toggleLike', () => {
  it('should remove a favorite when it exists', async () => {
    // Arrange
    const req = {
      body: {
        commentId: '6536425fa2cbe03e96e6865a',
        profileId: '653613ee9a0a75b59e0435c6',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock FavoriteModel.findOne to return a favorite
    FavoriteModel.findOne.mockResolvedValue({});

    // Act
    await toggleLike(req, res);

    // Assert
    expect(FavoriteModel.findOne).toHaveBeenCalledWith({
      commentId: '6536425fa2cbe03e96e6865a',
      profileId: '653613ee9a0a75b59e0435c6',
    });
    expect(FavoriteModel.deleteOne).toHaveBeenCalledWith({
      commentId: '6536425fa2cbe03e96e6865a',
      profileId: '653613ee9a0a75b59e0435c6',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      data: {
        commentId: '6536425fa2cbe03e96e6865a',
        profileId: '653613ee9a0a75b59e0435c6',
      },
    });
  });

  it('should add a favorite when it does not exist', async () => {
    // Arrange
    const req = {
      body: {
        commentId: '6536425fa2cbe03e96e6865a',
        profileId: '653613ee9a0a75b59e0435c6',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock FavoriteModel.findOne to return null (favorite doesn't exist)
    FavoriteModel.findOne.mockResolvedValue(null);

    // Mock FavoriteModel.create to return the created favorite
    const newFavorite = new FavoriteModel(req.body);
    FavoriteModel.prototype.save.mockResolvedValue(newFavorite);

    // Act
    await toggleLike(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      data: newFavorite,
    });
  });

  it('should handle errors when toggling a favorite', async () => {
    // Arrange
    const req = {
      body: {
        commentId: '6536425fa2cbe03e96e6865a',
        profileId: '653613ee9a0a75b59e0435c6',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock FavoriteModel.findOne to reject with an error
    const errorMessage = 'Error finding favorite';
    FavoriteModel.findOne.mockRejectedValue(errorMessage);

    // Act
    await toggleLike(req, res);

    // Assert
    expect(FavoriteModel.findOne).toHaveBeenCalledWith({
      commentId: '6536425fa2cbe03e96e6865a',
      profileId: '653613ee9a0a75b59e0435c6',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 500,
      msg: errorMessage,
    });
  });
});

// You can add more test cases for different scenarios as needed.
