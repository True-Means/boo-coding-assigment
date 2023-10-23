const {
  createProfile,
} = require("../profile.controller");
const ProfileModel = require("../../models/profile.model");

// Mock the models before running your tests.
ProfileModel.findOne = jest.fn();
ProfileModel.prototype.save = jest.fn();

describe("createProfile", () => {
  it("should create a new profile", async () => {
    const req = {
      body: {
        name: "Joseph1",
        description: "Joseph Anello",
        mbti: "INFJ",
        enneagram: "4w5",
        variant: 'sp/so',
        tritype: 500,
        socionics: 'SOC',
        sloan: 'RCOEN',
        psyche: 'FEVL',
        image: 'https://soulverse.boo.world/images/1.png',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    // Mock the ProfileModel.findOne to return null (name not already used)
    ProfileModel.findOne.mockResolvedValue(null);

    const newProfile = new ProfileModel(req.body);
    ProfileModel.prototype.save.mockResolvedValue(newProfile);

    await createProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ code: 200, data: newProfile });
  });

  it('should return an error message if the name is already used', async () => {
    // Arrange
    const req = {
      body: {
        name: 'Joseph', 
        description: "Joseph Anello",
        mbti: "INFJ",
        enneagram: "4w5",
        variant: 'sp/so',
        tritype: 500,
        socionics: 'SOC',
        sloan: 'RCOEN',
        psyche: 'FEVL',
        image: 'https://soulverse.boo.world/images/1.png',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the ProfileModel.findOne to return a profile with the same name (name already used)
    ProfileModel.findOne.mockResolvedValue({ name: 'Joseph' });

    // Act
    await createProfile(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'name already used' });
  });
});
