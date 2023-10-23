const {
  getProfileById,
} = require("../profile.controller");
const ProfileModel = require("../../models/profile.model");

// Mock the ProfileModel.findById function
ProfileModel.findById = jest.fn();

describe("getProfileById", () => {
  it("should return a profile when a valid ID is provided", async () => {
    const validProfileId = '65361a8478d195167b67af2f'; // Replace with an actual profile ID
    const expectedProfile = {
      _id: validProfileId,
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
      // Other profile data
    };
    
    // Mock the ProfileModel.findById to return the expected profile
    ProfileModel.findById.mockResolvedValue(expectedProfile);

    const result = await getProfileById(validProfileId);

    expect(result).toEqual(expectedProfile);
  });

  it('should return null when an invalid or non-existent ID is provided', async () => {
    // Arrange
    const invalidProfileId = '65361a8478d195167b67af31'; // Replace with an invalid or non-existent profile ID

    // Mock the ProfileModel.findById to return null (profile not found)
    ProfileModel.findById.mockResolvedValue(null);

    // Act
    const result = await getProfileById(invalidProfileId);

    // Assert
    expect(result).toBeNull();
  });
});
