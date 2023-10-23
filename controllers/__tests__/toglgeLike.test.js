const { toggleLike } = require("../comment.controller");
const FavoriteModel = require("../../models/favorites.model");

jest.mock("../../models/favorites.model", () => ({
  findOne: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
}));

describe('toggleLike', () => {
  it('should create a favorite if it does not exist', async () => {
    const req = {
      params: { commentId: '14daaefa45512', profileId: '3746aebb23512' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the findOne method to return null (favorite does not exist)
    FavoriteModel.findOne.mockResolvedValue(req.params);

    // Mock the create method
    FavoriteModel.create.mockResolvedValues({ commentId: '14daaefa4552', profileId: '3746aebb234' });

    await toggleLike(req, res);

    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   code: 200,
    //   data: undefined,
    // });

    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   code: 200,
    //   data: {
    //     commentId: '14daaefa4552',
    //     profileId: '3746aebb234',
    //   },
    // });

    expect(FavoriteModel.findOne).toHaveBeenCalledWith({ commentId: '14daaefa455', profileId: '3746aebb234' });
    expect(FavoriteModel.create).toHaveBeenCalledWith({ code: 200, data: { commentId: '14daaefa4552', profileId: '3746aebb234' } });

    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({ code: 200, data: { commentId: '14daaefa4552', profileId: '3746aebb234' } });
  });

  // it('should delete a favorite if it exists', async () => {
  //   const req = {
  //     params: { commentId: '14daaefa4552', profileId: '3746aebb234' },
  //   };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   // Mock the findOne method to return a favorite
  //   FavoriteModel.findOne.mockResolvedValue({ /* favorite data */ });

  //   // Mock the deleteOne method
  //   FavoriteModel.deleteOne.mockResolvedValue({ /* deleted data */ });

  //   await toggleLike(req, res);

  //   expect(FavoriteModel.findOne).toHaveBeenCalledWith({
  //     commentId: '14daaefa4552',
  //     profileId: '3746aebb234',
  //   });
  //   expect(FavoriteModel.deleteOne).toHaveBeenCalledWith({
  //     commentId: '14daaefa4552',
  //     profileId: '3746aebb234',
  //   });

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({ code: 200, data: { /* deleted data */ } });
  // });

  it('should handle errors', async () => {
    const req = {
      params: { commentId: '14daaefa4552', profileId: '3746aebb234' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the findOne method to throw an error
    FavoriteModel.findOne.mockRejectedValue(new Error('Favorite retrieval error'));

    await toggleLike(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ code: 500, msg: 'Error: Favorite retrieval error' });
  });
});