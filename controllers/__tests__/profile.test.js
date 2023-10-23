const { createProfile, getProfileById } = require("../profile.controller");
const ProfileModel = require("../../models/profile.model");
const { fakeUserData } = require("../../utils/faker-data");
const {
  validateResponseStatus,
  validateResponseJson,
} = require("../../utils/test-validators.utils");
const { dbConnect, dbDisconnect } = require("../../utils/dbHandler.utils");

ProfileModel.findOne = jest.fn();
ProfileModel.findById = jest.fn();
ProfileModel.prototype.save = jest.fn();

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe("Profile API Test Suite", () => {
  it("should return a profile when a valid ID is provided", async () => {
    const validProfileId = "65361a8478d195167b67af2f";
    const expectedProfile = {
      _id: validProfileId,
      ...fakeUserData,
    };

    ProfileModel.findById.mockResolvedValue(expectedProfile);

    const result = await getProfileById(validProfileId);

    expect(result).toEqual(expectedProfile);
  });

  it("should return null when an invalid or non-existent ID is provided", async () => {
    const invalidProfileId = "65361a8478d195167b67af31";

    ProfileModel.findById.mockResolvedValue(null);
    const result = await getProfileById(invalidProfileId);

    expect(result).toBeNull();
  });

  it("should create a new profile", async () => {
    const req = {
      body: fakeUserData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    ProfileModel.findOne.mockResolvedValue(null);

    const newProfile = new ProfileModel(req.body);
    ProfileModel.prototype.save.mockResolvedValue(newProfile);

    await createProfile(req, res);

    validateResponseStatus(res.status, 200);
    validateResponseJson(res.json, { code: 200, data: newProfile });
  });

  it("should return an error message if the name is already used", async () => {
    const req = {
      body: fakeUserData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    ProfileModel.findOne.mockResolvedValue({ name: "Naruhito" });

    await createProfile(req, res);

    validateResponseStatus(res.status, 400);
    validateResponseJson(res.json, { message: "name already used" });
  });
});
